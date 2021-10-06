import ConditionBuilder from "./ConditionBuilder";

const ALL_PROPERTIES = 'ALL_PROPERTIES';

export default class ColumnView {

  #items;
  #depth;
  #max;
  #parentCategoryId;
  #inputMapAttribute;
  #ROOT;

  constructor(
    selector,
    items,
    values,
    depth,
    propertyId,
    parentCategoryId
  ) {
    console.log(arguments)
    // this.#items = items;
    this.#depth = depth;
    this.#parentCategoryId = parentCategoryId;

    this.#draw(propertyId, values, depth);
  }

  #draw(propertyId, values, depth) {
    console.log(propertyId, values)
    const selectedCategoryIds = ConditionBuilder.getSelectedCategoryIds(propertyId);
    const parentItem = this.#parentCategoryId ? items[this.#parentCategoryId] : undefined;

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
              ? `
                data-parent-category-id="${this.#parentCategoryId ?? ''}"
                data-parent-label="${parentItem.label}"`
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
    listItems.forEach(tr => {
      values.find(value => value.categoryId == tr.dataset.categoryId).elm = tr;
    });

    // drill down event
    tbody.querySelectorAll(':scope > .item.-haschild > .drilldown').forEach(drilldown => {
      drilldown.addEventListener('click', () => {
        const tr = drilldown.closest('tr');
        tr.classList.add('-selected');
        // delete an existing lower columns
        if (selector.currentColumns.length > depth + 1) {
          for (let i = depth + 1; i < selector.currentColumns.length; i++) {
            // if (selector.currentColumns[i].parentNode) this.#CONTAINER.removeChild(selector.currentColumns[i]);
            if (selector.currentColumns[i].parentNode) selector.currentColumns[i].remove();
          }
        }
        // deselect siblings
        const selectedItemKeys = Object.keys(values).filter(id => values[id].selected && values[id].depth >= depth);
        for (const key of selectedItemKeys) {
          values[key].selected = false;
          selector.currentColumns[depth].querySelector(`[data-id="${key}"]`)?.classList.remove('-selected');
        }
        // get lower column
        values[tr.dataset.id].selected = true;
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
    // if (depth === 0) this.#ITEM_ALL_INPUT_OF_ROOT = inputMapAttribute;

    // this.#columns.push({column, parentCategoryId, max});
    // this.#update(App.viewModes.log10);
    // return column;
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
    return this.#ROOT.querySelectorAll(':scope > table > tbody > .item');
  }

}