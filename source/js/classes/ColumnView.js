
export default class ColumnView {

  #items;
  #depth;
  #parentCategoryId;

  constructor(selector, items, depth, parentCategoryId) {
    console.log(arguments)
    // this.#items = items;
    this.#depth = depth;
    this.#parentCategoryId = parentCategoryId;

    this.#draw();
  }

  #draw(
    selector,
    propertyId,
    items,
    values,
    depth,
    parentCategoryId
  ) {
    const selectedCategoryIds = ConditionBuilder.getSelectedCategoryIds(propertyId);
    const parentItem = parentCategoryId ? items[parentCategoryId] : undefined;

    // make column
    const column = document.createElement('div');
    const isSelected = ConditionBuilder.isSelectedProperty(propertyId, parentCategoryId);
    column.classList.add('column');
    let max = 0;
    column.innerHTML = `
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
            parentCategoryId
              ? `
                data-parent-category-id="${parentCategoryId ?? ''}"
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
        max = Math.max(max, item.count);
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
    const tbody = column.querySelector(':scope > table > tbody');
    const listItems = tbody.querySelectorAll(':scope > .item');
    listItems.forEach(tr => items[tr.dataset.categoryId].elm = tr);

    // drill down event
    tbody.querySelectorAll(':scope > .item.-haschild > .drilldown').forEach(drilldown => {
      drilldown.addEventListener('click', () => {
        const tr = drilldown.closest('tr');
        tr.classList.add('-selected');
        // delete an existing lower columns
        if (this.#currentColumns.length > depth + 1) {
          for (let i = depth + 1; i < this.#currentColumns.length; i++) {
            if (this.#currentColumns[i].parentNode) this.#CONTAINER.removeChild(this.#currentColumns[i]);
          }
        }
        // deselect siblings
        const selectedItemKeys = Object.keys(items).filter(id => items[id].selected && items[id].depth >= depth);
        for (const key of selectedItemKeys) {
          items[key].selected = false;
          this.#currentColumns[depth].querySelector(`[data-id="${key}"]`)?.classList.remove('-selected');
        }
        // get lower column
        items[tr.dataset.id].selected = true;
        this.#setSubColumn(tr.dataset.id, depth + 1);
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
    const itemAllInput = column.querySelector(':scope > table > thead > .item.-all > .label > label > input');
    itemAllInput.addEventListener('change', e => {
      const parentCategoryId = e.target.closest('.item.-all').dataset.parentCategoryId;
      if (e.target.checked) {
        ConditionBuilder.addProperty(propertyId, parentCategoryId);
      } else {
        ConditionBuilder.removeProperty(propertyId, parentCategoryId);
      }
    });
    if (depth === 0) this.#ITEM_ALL_INPUT_OF_ROOT = itemAllInput;

    this.#columns.push({column, parentCategoryId, max});
    this.#update(App.viewModes.log10);
    return column;
  }

  get depth() {
    return this.#depth;
  }

  get parentCategoryId() {
    return this.#parentCategoryId;
  }

}