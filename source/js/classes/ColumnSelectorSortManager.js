import DefaultEventEmitter from "./DefaultEventEmitter";
import * as event from '../events';

const SORTABLE_COLUMNS = ['label', 'total'];

class ColumnSelectorSortManager {

  #status;

  constructor() {

    // get data from local strage
    const column = window.localStorage.getItem('sortColumn');
    const status = window.localStorage.getItem('sortDirectionEachOfColumns');
    if (status) {
      this.#status = new Map(JSON.parse(status));
    } else {
      this.#status = new Map(SORTABLE_COLUMNS.map(column => [column, '']));
    }
    this.#setDocument(column);

  }


  // private methods

  #setDocument(column) {
    document.body.dataset.sortColumn = column;
    document.body.dataset.sortDirection = this.#status.get(column);
  }


  // public methods

  setSort(column) {

    // set sort
    const direction = ({
      '': 'asc',
      asc: 'desc',
      desc: ''
    })[this.#status.get(column)];
    this.#status.set(column, direction);
    this.#setDocument(column);

    // dispatch event
    const customEvent = new CustomEvent(event.changeColumnSelectorSorter, {detail: {column, direction}});
    DefaultEventEmitter.dispatchEvent(customEvent);

    // set local storage
    window.localStorage.setItem('sortColumn', column);
    window.localStorage.setItem('sortDirectionEachOfColumns', JSON.stringify(Array.from(this.#status)));
  }


  // accessors

  get sortableColumns() {
    return SORTABLE_COLUMNS;
  }

  get sortDescriptor() {
    const column = document.body.dataset.sortDirection === '' ? '' : document.body.dataset.sortColumn;
    const direction = document.body.dataset.sortDirection;
    return {column, direction};
  }

}

export default new ColumnSelectorSortManager();
