import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
import App from "./App";
import Records from "./Records";
import * as event from '../events';
import * as queryTemplates from '../functions/queryTemplates';

const ALL_PROPERTIES = 'ALL_PROPERTIES';

export default class ColumnView {

  #depth;
  #selector;
  #max;
  // #propertyId;
  #parentCategoryId;
  #inputMapAttribute;
  #itemNodes;
  #cachedUserValues;
  #ROOT;

  constructor(
    selector,
    values,
    depth,
    parentCategoryId
  ) {
    // console.log(arguments)

    // set members
    this.#depth = depth;
    this.#selector = selector;
    // this.#propertyId = propertyId;
    this.#parentCategoryId = parentCategoryId;
    this.#cachedUserValues = new Map();

    // draw
    this.#draw(values);
    this.#update(App.viewModes.log10);

    // even listener
    DefaultEventEmitter.addEventListener(event.mutatePropertyCondition, ({detail}) => {
      if (detail.action === 'remove') {
        if (this.#selector.propertyId === detail.propertyId) {
          if (detail.parentCategoryId && detail.parentCategoryId == this.#parentCategoryId) {
            this.inputMapAttribute.checked = false;
          }
        }
      }
    });
    DefaultEventEmitter.addEventListener(event.mutatePropertyValueCondition, ({detail}) => {
      if (this.#selector.propertyId === detail.propertyId) {
        this.#itemNodes.forEach(tr => {
          const checkbox = tr.querySelector(':scope > .label > label > input[type="checkbox"]');
          if (tr.dataset.id == detail.categoryId) {
            checkbox.checked = detail.action === 'add';
          }
        });
      }
    });
    DefaultEventEmitter.addEventListener(event.changeViewModes, e => this.#update(e.detail.log10));
    DefaultEventEmitter.addEventListener(event.setUserValues, e => this.#setUserValues(e.detail));
    DefaultEventEmitter.addEventListener(event.clearUserValues, () => this.#clearUserValues());
  }

  #draw(values) {
    const selectedCategoryIds = ConditionBuilder.getSelectedCategoryIds(this.#selector.propertyId);

    // make column
    this.#ROOT = document.createElement('div');
    const isSelected = ConditionBuilder.isSelectedProperty(this.#selector.propertyId, this.#parentCategoryId);
    this.#ROOT.classList.add('column');
    this.#max = 0;
    this.#ROOT.innerHTML = `
    <table>
      <thead>
        <tr class="header">
          <th class="label">Values</th>
          <th class="total">Total</th>
          <th class="mapped">Mapped</th>
          <th class="pvalue">p-value</th>
          <th class="drilldown"></th>
        </tr>
        <tr
          class="item -all"
          ${
            this.#parentCategoryId
              ? `data-parent-category-id="${this.#parentCategoryId ?? ''}"`
              : ''
          }
          data-category-ids="${values.map(item => item.categoryId)}"
          data-depth="${this.#depth}">
          <td class="label" colspan="5">
            <label>
              <input
                type="checkbox"
                value="${ALL_PROPERTIES}" 
                ${isSelected ? ' checked' : ''}/>
              Map following attributes
            </label>
          </td>
        </tr>
      </thead>
      <tbody>${values.map(item => {
        this.#max = Math.max(this.#max, item.count);
        const checked = selectedCategoryIds.indexOf(item.categoryId) !== -1
          ? ' checked'
          : '';
        return `
        <tr
          class="item${item.hasChild ? ' -haschild' : ''}"
          data-id="${item.categoryId}"
          data-category-id="${item.categoryId}"
          data-count="${item.count}">
          <td class="label">
            <label>
              <input class="value" type="checkbox" value="${item.categoryId}"${checked}/>
              ${item.label}
            </label>
          </td>
          <td class="total">${item.count.toLocaleString()}</td>
          <td class="mapped"></td>
          <td class="pvalue"></td>
          <td class="drilldown"></td>
        </tr>`;
      }).join('')}</tbody>
    </table>
    `;
    const tbody = this.#ROOT.querySelector(':scope > table > tbody');
    this.#itemNodes = Array.from(tbody.querySelectorAll(':scope > .item'));

    this.#itemNodes.forEach(itemNode => {
      // select/deselect a item (attribute) > label
      const valueCheckbox = itemNode.querySelector(':scope > .label > label > input.value[type="checkbox"]');
      valueCheckbox.addEventListener('click', this.#checkValue.bind(this));
      // drill down event
      if (itemNode.classList.contains('-haschild')) {
        const drilldown = itemNode.querySelector(':scope > .drilldown');
        drilldown.addEventListener('click', this.#drillDown.bind(this));
      }
    });

    // Map attributes event
    this.#inputMapAttribute = this.#ROOT.querySelector(':scope > table > thead > .item.-all > .label > label > input');
    this.#inputMapAttribute.addEventListener('change', e => {
      if (e.target.checked) {
        ConditionBuilder.addProperty(this.#selector.propertyId, this.#parentCategoryId);
      } else {
        ConditionBuilder.removeProperty(this.#selector.propertyId, this.#parentCategoryId);
      }
    });
  }

  #checkValue(e) {
    e.stopPropagation();
    const checkbox = e.target;
    const ancestors = [];
    let parentCategoryId;
    let column = checkbox.closest('.column');
    do { // find ancestors
      parentCategoryId = column?.querySelector(':scope > table > thead > tr.item.-all').dataset.parentCategoryId;
      if (parentCategoryId) {
        ancestors.unshift(parentCategoryId);
        column = column.previousElementSibling;
      }
    } while (parentCategoryId);
    if (checkbox.checked) { // add
      ConditionBuilder.addPropertyValue(
        this.#selector.propertyId,
        checkbox.value,
        ancestors
      );
    } else { // remove
      ConditionBuilder.removePropertyValue(this.#selector.propertyId, checkbox.value);
    }
  }

  // #checkKey(e) {
  // }

  #drillDown(e) {
    const itemNode = e.target.closest('tr');
    itemNode.classList.add('-selected');
    this.#selector.drillDown(itemNode.dataset.id, this.#depth);
  }

  #update(isLog10) {
    let max = isLog10 && this.#max > 1 ? Math.log10(this.#max) : this.#max;
    this.#itemNodes.forEach(tr => {
      const count = Number(tr.dataset.count);
      const subject = Records.getSubjectWithPropertyId(this.#selector.propertyId);
      tr.style.backgroundColor = `rgb(${subject.color.mix(App.colorWhite, 1 - (isLog10 ? Math.log10(count) : count) / max).coords.map(cood => cood * 256).join(',')})`;
    });
  }

  #getUserValues(query) {
    return new Promise((resolve, reject) => {
      const values = this.#cachedUserValues.get(query);
      if (values) {
        resolve(values);
      } else {
        axios
          .get(query)
          .then(response => {
            this.#cachedUserValues.set(query, response.data);
            resolve(response.data);
          });
      }
    });
  }

  #setUserValues({propertyId, values}) {
    if (this.#selector.propertyId === propertyId) {
      for (const value of values) {
        const itemNode = this.#itemNodes.find(itemNode => itemNode.dataset.categoryId == value.categoryId);
        if (itemNode) {
          itemNode.classList.add('-pinsticking');
          itemNode.querySelector(':scope > .mapped').textContent = value.hit_count ? value.hit_count.toLocaleString() : '';
          itemNode.querySelector(':scope > .pvalue').textContent = value.pValue ? value.pValue.toExponential(2) : '';
          if (value.hit_count === 0) itemNode.classList.remove('-pinsticking');
          else itemNode.classList.add('-pinsticking');
        }
      }
    }
  }

  #clearUserValues() {
    for (const itemNode in this.#itemNodes) {
      itemNode.classList.remove('-pinsticking');
    }
  }


  // public Methods

  appended() {
    // TODO: これをきっかけに描画をするようにする
    // user IDs
    if (document.body.classList.contains('-showuserids') && ConditionBuilder.userIds) {
      this.#getUserValues(
        queryTemplates.dataFromUserIds(
          this.#selector.sparqlet,
          this.#selector.primaryKey,
          this.#parentCategoryId
          )
        )
        .then(values => {
          console.log(values)
          this.#setUserValues({
            propertyId: this.#selector.propertyId,
            values
          });
        });
    }
  }


  // accessors

  get parentCategoryId() {
    return this.#parentCategoryId;
  }

  get inputMapAttribute() {
    return this.#inputMapAttribute;
  }

  get rootNode() {
    return this.#ROOT;
  }

}
