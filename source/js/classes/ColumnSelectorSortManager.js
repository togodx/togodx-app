import DefaultEventEmitter from "./DefaultEventEmitter";
import * as event from '../events';

const SORTABLE_COLUMNS = ['label', 'total'];

class ColumnSelectorSortManager {

  #status;

  constructor() {

    this.#status = new Map(SORTABLE_COLUMNS.map(column => [column, '']));
    document.body.dataset.sortColumn = '';
    document.body.dataset.sortDirection = '';

    // TODO: Local storage に保存

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
    document.body.dataset.sortColumn = column;
    document.body.dataset.sortDirection = direction;

    // dispatch event
    const customEvent = new CustomEvent(event.changeColumnSelectorSorter, {detail: {column, direction}});
    DefaultEventEmitter.dispatchEvent(customEvent);
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
