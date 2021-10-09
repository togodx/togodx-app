import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
import App from "./App";
import Records from "./Records";
import * as event from '../events';

const ALL_PROPERTIES = 'ALL_PROPERTIES';

export default class ColumnView {

  #depth;
  #selector;
  #max;
  #propertyId;
  #parentCategoryId;
  #inputMapAttribute;
  #itemNodes;
  #ROOT;

  constructor(
    selector,
    values,
    depth,
    propertyId,
    parentCategoryId
  ) {
    console.log(arguments)

    // set members
    this.#depth = depth;
    this.#selector = selector;
    this.#propertyId = propertyId;
    this.#parentCategoryId = parentCategoryId;

    // draw
    this.#draw(values);
    this.#update(App.viewModes.log10);

    // even listener
    DefaultEventEmitter.addEventListener(event.mutatePropertyCondition, ({detail}) => {
      if (detail.action === 'remove') {
        if (this.#propertyId === detail.propertyId) {
          if (detail.parentCategoryId && detail.parentCategoryId == this.parentCategoryId) {
            this.inputMapAttribute.checked = false;
          }
        }
      }
    });
    DefaultEventEmitter.addEventListener(event.mutatePropertyValueCondition, ({detail}) => {
      if (this.#propertyId === detail.propertyId) {
        this.itemNodes.forEach(tr => {
          const checkbox = tr.querySelector(':scope > .label > label > input[type="checkbox"]');
          if (tr.dataset.id == detail.categoryId) {
            checkbox.checked = detail.action === 'add';
          }
        });
      }
    });
    DefaultEventEmitter.addEventListener(event.changeViewModes, e => this.#update(e.detail.log10));
    DefaultEventEmitter.addEventListener(event.setUserValues, e => this.#setUserValues(e.detail));

  }

  #draw(values) {
    const selectedCategoryIds = ConditionBuilder.getSelectedCategoryIds(this.#propertyId);

    // make column
    this.#ROOT = document.createElement('div');
    const isSelected = ConditionBuilder.isSelectedProperty(this.#propertyId, this.#parentCategoryId);
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
        ConditionBuilder.addProperty(this.#propertyId, this.#parentCategoryId);
      } else {
        ConditionBuilder.removeProperty(this.#propertyId, this.#parentCategoryId);
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
        this.#propertyId,
        checkbox.value,
        ancestors
      );
    } else { // remove
      ConditionBuilder.removePropertyValue(this.#propertyId, checkbox.value);
    }
  }

  // #checkKey(e) {
  // }

  #drillDown(e) {
    const itemNode = e.target.closest('tr');
    itemNode.classList.add('-selected');
    this.#selector.drillDown(itemNode.dataset.id, this.#depth);


    // // delete an existing lower columns
    // if (this.#selector.currentColumnViews.length > this.#depth + 1) {
    //   for (let i = this.#depth + 1; i < this.#selector.currentColumnViews.length; i++) {
    //     if (this.#selector.currentColumnViews[i].parentNode) this.#selector.currentColumnViews[i].remove();
    //   }
    // }
    // // deselect siblings
    // const selectedItemKeys = Object.keys(values).filter(id => values[id].selected && values[id].depth >= this.#depth);
    // for (const key of selectedItemKeys) {
    //   values[key].selected = false;
    //   this.#selector.currentColumnViews[this.#depth].querySelector(`[data-id="${key}"]`)?.classList.remove('-selected');
    // }
    // // get lower column
    // // this.#selector.setSelectedValue(itemNode.dataset.id, true);
    // this.#selector.setSubColumn(itemNode.dataset.id, this.#depth + 1);
  }

  #update(isLog10) {
    let max = isLog10 && this.max > 1 ? Math.log10(this.max) : this.max;
    this.itemNodes.forEach(tr => {
      const count = Number(tr.dataset.count);
      const subject = Records.getSubjectWithPropertyId(this.#propertyId);
      tr.style.backgroundColor = `rgb(${subject.color.mix(App.colorWhite, 1 - (isLog10 ? Math.log10(count) : count) / max).coords.map(cood => cood * 256).join(',')})`;
    });
  }

  #setUserValues({propertyId, values}, bySubdirectory = false) {
    if (this.#propertyId === propertyId) {
      for (const value of values) {
        const itemNode = this.#itemNodes.filter(itemNode => itemNode.dataset.categoryId == value.categoryId);
        // const item = this.#items[value.categoryId];
        if (itemNode) {
          itemNode.classList.add('-pinsticking');
          itemNode.querySelector(':scope > .mapped').textContent = value.hit_count ? value.hit_count.toLocaleString() : '';
          itemNode.querySelector(':scope > .pvalue').textContent = value.pValue ? value.pValue.toExponential(2) : '';
          if (value.hit_count === 0) itemNode.classList.remove('-pinsticking');
          else itemNode.classList.add('-pinsticking');
        }
      }
      // if it doesnt called by subdirectory, get values of subdirectories
      // if (!bySubdirectory) {
      //   this.#currentColumnViews.forEach((columnView, index) => {
      //     if (index > 0) {
      //       this.#getUserValues(
      //         queryTemplates.dataFromUserIds(
      //           this.#property.data,
      //           this.#property.primaryKey,
      //           columnView.inputMapAttribute.dataset.parentCategoryId
      //         )
      //       )
      //         .then(values => {
      //           this.#setUserValues({
      //             propertyId: this.#property.propertyId,
      //             values
      //           }, true);
      //         });
      //       }
      //   });
      // }
    }
  }

  get depth() {
    return this.#depth;
  }

  get parentCategoryId() {
    return this.#parentCategoryId;
  }

  get inputMapAttribute() {
    return this.#inputMapAttribute;
  }

  get max() {
    return this.#max;
  }

  get rootNode() {
    return this.#ROOT;
  }

  get itemNodes() {
    return this.#itemNodes;
  }

}
