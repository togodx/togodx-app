import {LitElement, html, nothing} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {flip} from './flipColumn';
import {styles} from './CategoryBrowserColumn.css';
import {createRef, ref} from 'lit/directives/ref.js';
import {observable} from '../../../functions/util';

export default class CategoryBrowserColumn extends LitElement {
  #columnWidths = [];
  #columnRef = createRef();
  #totalHeaderRef = createRef();
  #maxCountWidth = 0;
  #maxMappedWidth = 0;
  #maxPvalueWidth = 0;
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
    observable.subscribe('userFiltersSet', this.#userFiltersSet.bind(this));
  }

  #userFiltersSet(event) {
    this.userFiltersSet = event.userFiltersSet;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.idNodeMap.clear();
    observable.unsubscribe('userFiltersSet', this.#userFiltersSet.bind(this));
  }

  #getMaxCountWidth(title, valArr) {
    let max = 0;
    const countLabelsToCheck = valArr.concat(title);

    countLabelsToCheck.forEach(count => {
      const span = document.createElement('span');
      span.innerText = count;
      this.#columnRef.value?.appendChild(span);
      const countWidth = span.getBoundingClientRect().width;
      if (countWidth > max) {
        max = countWidth;
      }
      this.#columnRef.value?.removeChild(span);
    });

    return max;
  }

  willUpdate(changed) {
    if (changed.has('nodes')) {
      this.idNodeMap.clear();
      this.nodes.forEach(node => {
        this.idNodeMap.set(node.id, node);
      });
    }

    if (this.#columnRef.value && this.nodes.length > 0) {
      this.#maxCountWidth = this.#getMaxCountWidth(
        'Total',
        this.nodes.map(node => node.count?.toLocaleString())
      );
      if (this.userFiltersSet) {
        this.#maxMappedWidth = this.#getMaxCountWidth(
          'Mapped',
          this.nodes.map(node => node.mapped?.toLocaleString())
        );
        this.#maxPvalueWidth = this.#getMaxCountWidth(
          'p-value',
          this.nodes.map(node => node.pvalue?.toExponential(2))
        );
        console.log('this.#maxPvalueWidth', this.#maxPvalueWidth);
      }
    }

    if (changed.has('heroId')) {
      this.previousHeroId = changed.get('heroId');
    }

    // if (changed.has('userFiltersSet')) {
    //   console.log(' column willupdate userfilterset', this.userFiltersSet);
    // }
  }

  get containedId() {
    return this.nodes[0].id;
  }

  render() {
    return html`
      <div class="column" ${ref(this.#columnRef)}>
        ${this.containedId !== 'dummy'
          ? html`<div class="header-container">
              <div class="header">
                <div class="checkbox"></div>
                <div class="label">Values</div>
                <div class="count" style="width: ${this.#maxCountWidth}px">
                  Total
                </div>
                <div
                  class="mapped ${this.userFiltersSet
                    ? '-user-filter-set'
                    : ''}"
                  style="width: ${this.#maxMappedWidth}px"
                >
                  Mapped
                </div>
                <div
                  class="pvalue ${this.userFiltersSet
                    ? '-user-filter-set'
                    : ''}"
                  style="width: ${this.#maxPvalueWidth}px"
                >
                  p-value
                </div>
                <div class="drilldown"></div>
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
                    .checked=${this.checkedIds.includes(node.id)}
                    .countWidth=${this.#maxCountWidth}
                    .mappedWidth=${this.#maxMappedWidth}
                    .pvalueWidth=${this.#maxPvalueWidth}
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
