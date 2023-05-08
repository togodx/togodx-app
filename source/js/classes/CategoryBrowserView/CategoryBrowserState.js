import {LitState} from 'lit-element-state';

class CategoryBrowserState extends LitState {
  static get stateVars() {
    return {
      userFiltersSet: false,
      condition: document.body.dataset.condition,
    };
  }
}

export const state = new CategoryBrowserState();
