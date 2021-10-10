export default class ColumnItemView {

  #categoryId;
  #ROOT;
  #INPUT_VALUE;
  #INPUT_KEY;

  constructor(column, {count, categoryId, hasChild, label}, selectedCategoryIds) {
    // console.log(selectedCategoryIds, label);
    // console.log(categoryId);

    this.#categoryId = categoryId;

    // make HTML
    this.#ROOT = document.createElement('tr');
    this.#ROOT.classList.add('item');
    if (hasChild) this.#ROOT.classList.add('-haschild');
    this.#ROOT.dataset.id = categoryId;
    this.#ROOT.dataset.count = count;
    this.#ROOT.innerHTML = `
    <td class="label">
      <label>
        <input class="value" type="checkbox" value="${categoryId}"/>
        ${label}
      </label>
    </td>
    <td class="total">${count.toLocaleString()}</td>
    <td class="mapped"></td>
    <td class="pvalue"></td>
    <td class="drilldown"></td>`;

    // select/deselect a item (attribute) > label
    this.#INPUT_VALUE = this.#ROOT.querySelector(':scope > td.label > label> input.value');
    this.#INPUT_VALUE.addEventListener('click', column.checkValue.bind(column));

    // drill down
    if (hasChild) {
      const drilldown = this.#ROOT.querySelector(':scope > .drilldown');
      drilldown.addEventListener('click', column.drillDown.bind(column));
    }

    // if (selectedCategoryIds.indexOf(categoryId) !== -1) {
    //   this.#ROOT.querySelector(':scope > td.label > label> input.value').checked = true;
    // }
  }

  get rootNode() {
    return this.#ROOT;
  }

}