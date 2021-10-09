import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records";
import ColumnView from "./ColumnView";
import * as event from '../events';
import * as queryTemplates from '../functions/queryTemplates';

export default class ColumnSelectorView {

  #property;
  #items;
  #columnViews;
  #currentColumnViews;
  #userValues;
  #ROOT;
  #CONTAINER;
  #LOADING_VIEW;
  #INPUT_MAP_ATTRIBUTE_OF_ROOT;

  constructor(elm, property, items) {

    this.#property = property;
    this.#items = {};
    this.#columnViews = [];
    this.#currentColumnViews = [];
    this.#userValues = new Map();

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
    // DefaultEventEmitter.addEventListener(event.setUserValues, e => this.#setUserValues(e.detail));
    DefaultEventEmitter.addEventListener(event.clearUserValues, () => this.#clearUserValues());

    const depth = 0;
    this.#setItems(items, depth);

    // make root column
    const columnView = this.#makeCoumnView(items, depth);
    this.#appendSubColumn(columnView, depth);
  }
  

  // private methods

  #setItems(items, depth, parent) {
    for (const item of items) {
      const hasChild = item.hasChild && item.hasChild === true;
      this.#items[item.categoryId] = {
        label: item.label,
        parent,
        hasChild: hasChild ? true : false,
        depth,
        selected: false,
        checked: false
      }
      if (hasChild) this.#items[item.categoryId].children = [];
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
      this.#property.propertyId,
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
    // scroll
    const left = this.#CONTAINER.scrollWidth - this.#CONTAINER.clientWidth;
    if (left > 0) {
      this.#CONTAINER.scrollTo({
        top: 0,
        left: left,
        behavior: 'smooth'
      });
    };

    // user IDs
    if (document.body.classList.contains('-showuserids') && ConditionBuilder.userIds) {
      this.#getUserValues(
        queryTemplates.dataFromUserIds(
          this.#property.data,
          this.#property.primaryKey,
          column.querySelector(':scope > table > thead > .item.-all').dataset.parentCategoryId
          )
        )
        .then(values => {
          this.#setUserValues({
            propertyId: this.#property.propertyId,
            values
          }, true);
        });
    }
  }

  #mutatePropertyCondition({detail: {action, propertyId, parentCategoryId}}) {
    if (propertyId === this.#property.propertyId && parentCategoryId === undefined) {
      this.#INPUT_MAP_ATTRIBUTE_OF_ROOT.checked = action === 'add';
    }
  }

  #getUserValues(query) {
    return new Promise((resolve, reject) => {
      const values = this.#userValues.get(query);
      if (values) {
        resolve(values);
      } else {
        axios
          .get(query)
          .then(response => {
            this.#userValues.set(query, response.data);
            resolve(response.data);
          });
      }
    });
  }

  #setSelectedValue(categoryId, selected) {
    this.#items[categoryId].selected = selected;
  }

  #setUserValues({propertyId, values}, bySubdirectory = false) {
    if (this.#property.propertyId === propertyId) {
      for (const value of values) {
        const item = this.#items[value.categoryId];
        if (item) {
          item.elm.classList.add('-pinsticking');
          item.elm.querySelector(':scope > .mapped').textContent = value.hit_count ? value.hit_count.toLocaleString() : '';
          item.elm.querySelector(':scope > .pvalue').textContent = value.pValue ? value.pValue.toExponential(2) : '';
          if (value.hit_count === 0) item.elm.classList.remove('-pinsticking');
          else                       item.elm.classList.add('-pinsticking');
        }
      }
      // if it doesnt called by subdirectory, get values of subdirectories
      if (!bySubdirectory) {
        this.#currentColumnViews.forEach((columnView, index) => {
          if (index > 0) {
            this.#getUserValues(
              queryTemplates.dataFromUserIds(
                this.#property.data,
                this.#property.primaryKey,
                columnView.inputMapAttribute.dataset.parentCategoryId
              )
            )
              .then(values => {
                this.#setUserValues({
                  propertyId: this.#property.propertyId,
                  values
                }, true);
              });
            }
        });
      }
    }
  }

  #clearUserValues() {
    for (const item in this.#items) {
      this.#items[item].elm.classList.remove('-pinsticking');
    }
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

  // get currentColumnViews() {
  //   return this.#currentColumnViews;
  // }

}
