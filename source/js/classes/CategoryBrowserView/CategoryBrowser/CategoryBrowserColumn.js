import {LitElement, html, nothing} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {flip} from './flipColumn';
import {styles} from './CategoryBrowserColumn.css';

export default class CategoryBrowserColumn extends LitElement {
  static get styles() {
    return styles;
  }

  static get properties() {
    return {
      nodes: {type: Array, state: true},
      role: {type: String, state: true},
      checkedIds: {type: Array, state: true},
      heroId: {
        type: String,
        state: true,
      },
      userFiltersSet: {type: Boolean, state: true},
      scrolledHeroRect: {type: Object, state: true},
      animationOptions: {type: Object, state: true},
    };
  }
  constructor() {
    super();
    this.nodes = []; // array of nodes in children / parents, or [details]
    this.heroId = undefined;
    this.role = '';
    this.scrolledHeroRect = null;
    this.animationOptions = {};
    this.idNodeMap = new Map();
    this.userFiltersSet = false;
    this.checkedIds = [];
  }

  willUpdate(changed) {
    if (changed.has('nodes')) {
      this.nodes.forEach(node => {
        this.idNodeMap.set(node.id, node);
      });
    }
    if (changed.has('heroId')) {
      this.previousHeroId = changed.get('heroId');
    }
    if (changed.has('checkedIds')) {
      console.log('checkedIds changed', this.checkedIds);
    }
  }

  get containedId() {
    return this.nodes[0].id;
  }

  render() {
    console.log('Column, checkedIds', this.checkedIds);
    return html`
      <div class="column">
        ${this.containedId !== 'dummy'
          ? html`<div class="header-container">
              <div class="header">
                <div class="values">Values</div>
                <div class="total">Total</div>
                <div class="mapped">Mapped</div>
                <div class="p-value">p-value</div>
              </div>
            </div>`
          : nothing}
        ${this.nodes.length
          ? html`
              ${repeat(
                this.nodes,
                node => node.id,
                (node, index) => {
                  return html`<category-node
                    key="${node.id}"
                    id="${node.id}"
                    .data=${node}
                    .mode=${this.role}
                    .prevRect=${this.scrolledHeroRect}
                    .order=${this.nodes.length === 1
                      ? 'single'
                      : index === 0
                      ? 'first'
                      : index === this.nodes.length - 1
                      ? 'last'
                      : 'mid'}
                    .userFiltersSet=${this.userFiltersSet}
                    .checked=${this.checkedIds.includes(node.id)}
                    ${flip({
                      id: node.id,
                      heroId: this.heroId,
                      previousHeroId: this.previousHeroId,
                      role: this.role,
                      scrolledHeroRect: this.scrolledHeroRect,
                      options: this.animationOptions,
                    })}
                  />`;
                }
              )}
            `
          : nothing}
      </div>
    `;
  }
}

customElements.define('category-browser-column', CategoryBrowserColumn);
