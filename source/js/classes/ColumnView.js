import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
import * as event from '../events';

const ALL_PROPERTIES = 'ALL_PROPERTIES';

export default class ColumnView {

  #depth;
  #max;
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
    this.#parentCategoryId = parentCategoryId;

    // draw
    this.#draw(selector, propertyId, values, depth);

    // even listener
    DefaultEventEmitter.addEventListener(event.mutatePropertyCondition, ({detail}) => {
      if (detail.action === 'remove') {
        if (propertyId === detail.propertyId) {
          if (detail.parentCategoryId && detail.parentCategoryId == this.parentCategoryId) {
            this.inputMapAttribute.checked = false;
          }
        }
      }
    });
    DefaultEventEmitter.addEventListener(event.mutatePropertyValueCondition, ({detail}) => {
      if (propertyId === detail.propertyId) {
        this.itemNodes.forEach(tr => {
          const checkbox = tr.querySelector(':scope > .label > label > input[type="checkbox"]');
          if (tr.dataset.id == detail.categoryId) {
            checkbox.checked = detail.action === 'add';
          }
        });
      }
    });

  }

  #draw(selector, propertyId, values, depth) {
    const selectedCategoryIds = ConditionBuilder.getSelectedCategoryIds(propertyId);

    // make column
    this.#ROOT = document.createElement('div');
    const isSelected = ConditionBuilder.isSelectedProperty(propertyId, this.#parentCategoryId);
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
          data-depth="${depth}">
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
              <input type="checkbox" value="${item.categoryId}"${checked}/>
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
    const listItems = tbody.querySelectorAll(':scope > .item');
    // listItems.forEach(tr => {
    //   values.find(value => value.categoryId == tr.dataset.categoryId).elm = tr;
    // });
    this.#itemNodes = this.#ROOT.querySelectorAll(':scope > table > tbody > .item');

    // drill down event
    tbody.querySelectorAll(':scope > .item.-haschild > .drilldown').forEach(drilldown => {
      drilldown.addEventListener('click', () => {
        const tr = drilldown.closest('tr');
        tr.classList.add('-selected');
        // delete an existing lower columns
        if (selector.currentColumnViews.length > depth + 1) {
          for (let i = depth + 1; i < selector.currentColumnViews.length; i++) {
            if (selector.currentColumnViews[i].parentNode) selector.currentColumnViews[i].remove();
          }
        }
        // deselect siblings
        const selectedItemKeys = Object.keys(values).filter(id => values[id].selected && values[id].depth >= depth);
        for (const key of selectedItemKeys) {
          values[key].selected = false;
          selector.currentColumnViews[depth].querySelector(`[data-id="${key}"]`)?.classList.remove('-selected');
        }
        // get lower column
        // selector.setSelectedValue(tr.dataset.id, true);
        selector.setSubColumn(tr.dataset.id, depth + 1);
      });
    });

    listItems.forEach(tr => {
      // select/deselect a item (attribute) > label
      const checkbox = tr.querySelector(':scope > .label > label > input[type="checkbox"]');
      checkbox.addEventListener('click', e => {
        e.stopPropagation();
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
            propertyId,
            checkbox.value,
            ancestors
          );
        } else { // remove
          ConditionBuilder.removePropertyValue(propertyId, checkbox.value);
        }
      });
    });

    // Map attributes event
    this.#inputMapAttribute = this.#ROOT.querySelector(':scope > table > thead > .item.-all > .label > label > input');
    this.#inputMapAttribute.addEventListener('change', e => {
      // const parentCategoryId = e.target.closest('.item.-all').dataset.parentCategoryId;
      if (e.target.checked) {
        ConditionBuilder.addProperty(propertyId, this.#parentCategoryId);
      } else {
        ConditionBuilder.removeProperty(propertyId, this.#parentCategoryId);
      }
    });
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
