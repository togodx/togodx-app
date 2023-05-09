import {LitElement, html, nothing} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {flip} from './flipColumn';
import {styles} from './CategoryBrowserColumn.css';
import {createRef, ref} from 'lit/directives/ref.js';
import {observeState} from 'lit-element-state';
import {state} from '../CategoryBrowserState';

export default class CategoryBrowserColumn extends observeState(LitElement) {
  #columnRef = createRef();

  #maxCountWidth = 50;
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

    this.checkedIds = [];
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.idNodeMap.clear();
  }

  // TODO sometimes returns 0 sometimes not ... =/
  // #getMaxCountWidth(titleText, valArr) {
  //   const div = document.createElement('div');
  //   div.innerText = titleText;
  //   div.style.display = 'inline-block';
  //   div.style.paddingLeft = '0.3rem';
  //   const sorter = document.createElement('div');
  //   sorter.style.width = '1.2rem';
  //   sorter.style.display = 'inline-block';
  //   div.appendChild(sorter);
  //   document.body.appendChild(div);

  //   let max = div.getBoundingClientRect().width + 10;

  //   document.body.removeChild(div);

  //   valArr.forEach(text => {
  //     const span = document.createElement('span');
  //     span.innerText = text;
  //     this.#columnRef.value?.appendChild(span);
  //     const countWidth = span.getBoundingClientRect().width;
  //     if (countWidth > max) {
  //       max = countWidth;
  //     }
  //     this.#columnRef.value?.removeChild(span);
  //   });

  //   return max;
  // }

  willUpdate(changed) {
    if (changed.has('nodes')) {
      this.idNodeMap.clear();
      this.nodes.forEach(node => {
        this.idNodeMap.set(node.id, node);
      });
    }

    if (this.nodes.length > 0) {
      // this.#getMaxCountWidth(
      //   'Term',
      //   this.nodes.map(node => node.count?.toLocaleString())
      // );
      if (state.userFiltersSet) {
        this.#maxMappedWidth = 50;
        // this.#getMaxCountWidth(
        //   'Mapped',
        //   this.nodes.map(node => node.mapped?.toLocaleString())
        // );
        this.#maxPvalueWidth = 50;
        //  = this.#getMaxCountWidth(
        //   'p-value',
        //   this.nodes.map(node => node.pvalue?.toExponential(2))
        // );
      } else {
        this.#maxPvalueWidth = this.#maxMappedWidth = 0;
      }
    }

    if (changed.has('heroId')) {
      this.previousHeroId = changed.get('heroId');
    }
  }

  get containedId() {
    return this.nodes[0].id;
  }

  render() {
    return html`
      <div class="column" ${ref(this.#columnRef)}>
        ${this.containedId !== 'dummy'
          ? html`<div class="header-container">
              <div class="header-bg"></div>
              <div class="header">
                <div class="checkbox"></div>

                <category-browser-sorter
                  prop="label"
                  label="Term"
                  class="label"
                ></category-browser-sorter>
                <category-browser-sorter
                  style="width: ${this.#maxCountWidth}px"
                  prop="count"
                  label="Total"
                ></category-browser-sorter>
                <category-browser-sorter
                  prop="mapped"
                  class="mapped ${state.userFiltersSet
                    ? '-user-filter-set'
                    : ''}"
                  label="Mapped"
                  style="width: ${this.#maxCountWidth}px"
                ></category-browser-sorter>
                <category-browser-sorter
                  prop="pvalue"
                  label="p-value"
                  class="pvalue ${state.userFiltersSet
                    ? '-user-filter-set'
                    : ''}"
                  style="width: ${this.#maxPvalueWidth}px"
                ></category-browser-sorter>

                <div class="drilldown"></div>
              </div>
              <div class="header-bg"></div>
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
