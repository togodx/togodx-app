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
      editingCategory: '',
    };
  }
}

export const state = new CategoryBrowserState();

const mutationObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === 'attributes') {
      if (mutation.attributeName === 'data-condition') {
        state.condition = mutation.target.dataset.condition;
      }
      if (mutation.attributeName === 'data-editing-category') {
        state.editingCategory = mutation.target.dataset.editingCategory;
      }
    }
  });
});

mutationObserver.observe(document.body, {
  attributes: true,
  attributeFilter: ['data-condition', 'data-editing-category'],
});
