import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records";
import ColumnView from "./ColumnView";
import * as event from '../events';

export default class ColumnSelectorView {

  #property;
  #items;
  #columnViews;
  #currentColumnViews;
  #ROOT;
  #CONTAINER;
  #LOADING_VIEW;
  #INPUT_MAP_ATTRIBUTE_OF_ROOT;

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

    // even listener
    DefaultEventEmitter.addEventListener(event.mutatePropertyCondition, this.#mutatePropertyCondition.bind(this));

    const depth = 0;
    this.#setItems(items, depth);

    // make root column
    const columnView = this.#makeCoumnView(items, depth);
    this.#appendSubColumn(columnView, depth);
  }


  // private methods

  #setItems(items, depth, parent) {
    for (const item of items) {
      // const hasChild = item.hasChild && item.hasChild === true;
      this.#items[item.categoryId] = {
        // label: item.label,
        // parent,
        // hasChild: hasChild ? true : false,
        depth,
        selected: false,
        // checked: false
      }
      // if (hasChild) this.#items[item.categoryId].children = [];
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
            this.#setItems(values, depth, categoryId);
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
    if (depth === 0) this.#INPUT_MAP_ATTRIBUTE_OF_ROOT = columnView.inputMapAttribute;
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

  #mutatePropertyCondition({detail: {action, propertyId, parentCategoryId}}) {
    if (propertyId === this.#property.propertyId && parentCategoryId === undefined) {
      // this.#INPUT_MAP_ATTRIBUTE_OF_ROOT.checked = action === 'add';
    }
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

}
