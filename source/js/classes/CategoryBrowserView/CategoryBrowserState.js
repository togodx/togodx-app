import {LitState} from 'lit-element-state';

class CategoryBrowserState extends LitState {
  static get stateVars() {
    return {
      userFiltersSet: false,
      condition: document.body.dataset.condition,
      sortOrder: 'none',
      sortOrderOptions: [
        {value: 'none', label: 'None'},
        {value: 'asc', label: 'Ascending'},
        {value: 'desc', label: 'Descending'},
      ],
      sortProp: '',
    };
  }
}

export const state = new CategoryBrowserState();
