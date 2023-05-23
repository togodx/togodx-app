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
      rootNodeIds: new Set(),
    };
  }
}

export const state = new CategoryBrowserState();

const mutationObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === 'attributes') {
      state.condition = mutation.target.dataset.condition;
    }
  });
});

mutationObserver.observe(document.body, {
  attributes: true,
  attributeFilter: ['data-condition'],
});
