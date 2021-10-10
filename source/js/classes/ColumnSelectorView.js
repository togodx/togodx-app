import Records from "./Records";
import ColumnView from "./ColumnView";

export default class ColumnSelectorView {

  #property;
  #items;
  #columnViews;
  #currentColumnViews;
  #ROOT;
  #CONTAINER;
  #LOADING_VIEW;
  #CONTAINED_VIEW;

  constructor(elm, property, items) {

    this.#property = property;
    this.#items = {};
    this.#columnViews = [];
    this.#currentColumnViews = [];

    // make container
    elm.innerHTML = `
    <div class="column-selector-view">
      <div class="columns">
        <div class="inner"></div>
      </div>
      <div class="loading-view"></div>
    </div>`;
    this.#ROOT = elm.querySelector(':scope > .column-selector-view');
    this.#CONTAINER = this.#ROOT.querySelector(':scope > .columns > .inner');
    this.#LOADING_VIEW = this.#ROOT.querySelector(':scope > .loading-view');
    this.#CONTAINED_VIEW = this.#ROOT.closest('.track-view');

    const depth = 0;
    this.#setItems(items, depth);

    // make root column
    const columnView = this.#makeCoumnView(items, depth);
    this.#appendSubColumn(columnView, depth);
  }


  // private methods

  #setItems(items, depth) {
    for (const item of items) {
      this.#items[item.categoryId] = {
        depth,
        selected: false,
      }
    }
  }

  #getColumn(categoryId, depth) {
    return new Promise((resolve, reject) => {
      const columnView = this.#columnViews.find(columnView => columnView.parentCategoryId === categoryId);
      if (columnView) {
        resolve(columnView);
      } else {
        Records.fetchPropertyValues(this.#property.propertyId, categoryId)
          .then(values => {
            this.#setItems(values, depth);
            const columnView = this.#makeCoumnView(values, depth, categoryId);
            resolve(columnView);
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  }

  #makeCoumnView(values, depth, parentCategoryId) {
    const columnView = new ColumnView(
      this,
      values,
      depth,
      parentCategoryId
    );
    this.#columnViews.push(columnView);
    return columnView;
  }

  #setSubColumn(categoryId, depth) {
    this.#LOADING_VIEW.classList.add('-shown');
    this.#getColumn(categoryId, depth)
      .then(column => {
        this.#appendSubColumn(column, depth);
        this.#LOADING_VIEW.classList.remove('-shown');
      })
      .catch(error => {
        // TODO: エラー処理
        this.#LOADING_VIEW.classList.remove('-shown');
        throw Error(error);
      });
  }

  #appendSubColumn(columnView, depth) {
    this.#currentColumnViews[depth] = columnView;
    this.#CONTAINER.append(columnView.rootNode);
    columnView.appended();
    // scroll
    const left = this.#CONTAINER.scrollWidth - this.#CONTAINER.clientWidth;
    if (left > 0) {
      this.#CONTAINER.scrollTo({
        top: 0,
        left: left,
        behavior: 'smooth'
      });
    };
  }

  #setSelectedValue(categoryId, selected) {
    this.#items[categoryId].selected = selected;
  }


  // public methods

  drillDown(categoryId, depth) {
    // delete an existing lower columns
    if (this.#currentColumnViews.length > depth + 1) {
      for (let depth2 = depth + 1; depth2 < this.#currentColumnViews.length; depth2++) {
        const column = this.#currentColumnViews[depth2];
        if (column.rootNode.parentNode) column.rootNode.remove();
      }
    }
    // deselect siblings
    const selectedItemKeys = Object.keys(this.#items).filter(id => this.#items[id].selected && this.#items[id].depth >= depth);
    for (const key of selectedItemKeys) {
      this.#items[key].selected = false;
      this.#currentColumnViews[depth].rootNode.querySelector(`[data-id="${key}"]`)?.classList.remove('-selected');
    }
    // get lower column
    this.#setSelectedValue(categoryId, true);
    this.#setSubColumn(categoryId, depth + 1);
  }


  // accessors

  get propertyId() {
    return this.#property.propertyId;
  }

  get sparqlet() {
    return this.#property.data;
  }

  get primaryKey() {
    return this.#property.primaryKey;
  }

  get isShowing() {
    return this.#CONTAINED_VIEW.classList.contains('-spread');
  }

}
