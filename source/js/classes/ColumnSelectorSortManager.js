import DefaultEventEmitter from "./DefaultEventEmitter";
import * as event from '../events';

const SORTABLE_COLUMNS = ['label', 'total'];

class ColumnSelectorSortManager {

  #status;

  constructor() {

    this.#status = new Map(SORTABLE_COLUMNS.map(column => [column, '']));

    DefaultEventEmitter.addEventListener(event.changeColumnSelectorSorter, ({detail: {column}}) => {
      const direction = ({
        '': 'asc',
        asc: 'desc',
        desc: ''
      })[this.#status.get(column)];
      this.#status.set(column, direction);
      console.log(this.#status)
      document.body.dataset.sortColumn = column;
      document.body.dataset.sortDirection = direction;
    });

  }

  get sortableColumns() {
    return SORTABLE_COLUMNS;
  }

}

export default new ColumnSelectorSortManager();
