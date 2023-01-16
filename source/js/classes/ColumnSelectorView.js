import Records from './Records';
import ColumnView from './ColumnView';

export default class ColumnSelectorView {
  #attribute;
  #items;
  #columnViews;
  #currentColumnViews;
  #ROOT;
  #CONTAINER;
  #LOADING_VIEW;
  #CONTAINED_VIEW;

  constructor(elm, attribute, items) {
    this.#attribute = attribute;
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
    this.#CONTAINED_VIEW = this.#ROOT.closest('.attribute-track-view');

    const depth = 0;
    this.#setItems(items, depth);

    // make root column
    const columnView = this.#makeCoumnView(items, depth);
    this.#appendSubColumn(columnView, depth);
  }

  // private methods

  #setItems(items, depth) {
    for (const item of items) {
      this.#items[item.node] = {
        depth,
        selected: false,
      };
    }
  }

  #getColumn(node, depth) {
    return new Promise((resolve, reject) => {
      const columnView = this.#columnViews.find(
        columnView => columnView.parentNode === node
      );
      if (columnView) {
        resolve(columnView);
      } else {
        Records.fetchAttributeFilters(this.#attribute.id, node)
          .then(filters => {
            this.#setItems(filters, depth);
            const columnView = this.#makeCoumnView(filters, depth, node);
            resolve(columnView);
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  }

  #makeCoumnView(filters, depth, parentNode) {
    const columnView = new ColumnView(this, filters, depth, parentNode);
    this.#columnViews.push(columnView);
    return columnView;
  }

  #setSubColumn(node, depth) {
    this.#LOADING_VIEW.classList.add('-shown');
    this.#getColumn(node, depth)
      .then(column => {
        this.#appendSubColumn(column, depth);
        this.#LOADING_VIEW.classList.remove('-shown');
      })
      .catch(error => {
        // TODO: エラー処理
        this.#LOADING_VIEW.classList.remove('-shown');
        console.error(error);
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
        behavior: 'smooth',
      });
    }
  }

  #setSelectedFilter(node, selected) {
    this.#items[node].selected = selected;
  }

  // public methods

  drillDown(node, depth) {
    // delete an existing lower columns
    if (this.#currentColumnViews.length > depth + 1) {
      for (
        let depth2 = depth + 1;
        depth2 < this.#currentColumnViews.length;
        depth2++
      ) {
        const column = this.#currentColumnViews[depth2];
        if (column.rootNode.parentNode) column.rootNode.remove();
      }
    }
    // deselect siblings
    const selectedItemKeys = Object.keys(this.#items).filter(
      id => this.#items[id].selected && this.#items[id].depth >= depth
    );
    for (const key of selectedItemKeys) {
      this.#items[key].selected = false;
      this.#currentColumnViews[depth].rootNode
        .querySelector(`[data-id="${key}"]`)
        ?.classList.remove('-selected');
    }
    // get lower column
    this.#setSelectedFilter(node, true);
    this.#setSubColumn(node, depth + 1);
  }

  // accessors

  get attributeId() {
    return this.#attribute.id;
  }

  get api() {
    return this.#attribute.api;
  }

  get dataset() {
    return this.#attribute.dataset;
  }

  get isShowing() {
    return this.#CONTAINED_VIEW.classList.contains('-spread');
  }
}
