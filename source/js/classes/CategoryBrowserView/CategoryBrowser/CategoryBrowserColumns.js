import {LitElement, html} from 'lit';
import {ref, createRef} from 'lit/directives/ref.js';

import {repeat} from 'lit/directives/repeat.js';

import {styles} from './CategoryBrowserColumns.css';

export class CategoryBrowserColumns extends LitElement {
  static get styles() {
    return styles;
  }

  constructor() {
    super();
    this.flexRef = createRef();
    this.clipRef = createRef();
    this.nodeRef = createRef();
    this.movement = '';
    this.flexWidth = 0;
    this.deltaWidth = 0;
    this.nodeWidth = 0;
    this.gap = 0;
    this.animate = null;
    this.scrolledRect = null;
    this.checkedIds = [];
    this.sortOrder = 'none';

    this.dataColumns = {
      _parents: [],
      parents: [],
      hero: [],
      children: [],
      _children: [],
    };
    this.animationOptions = {
      duration: 500,
      easing: 'ease-in-out',
    };

    this._id = '';
    this._columns = ['parents', 'hero', 'children'];
    this.data = {};
  }

  static get properties() {
    return {
      data: {type: Object, state: true},
      _columns: {
        type: Array,
        state: true,
      },
      checkedIds: {type: Array, state: true},
      sortOrder: {type: String, state: true},
    };
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('data')) {
      // if (changedProperties.get('data')) {
      if (this.data && this.data.details) {
        if (
          this.data.details.id &&
          changedProperties.get('data').details?.id !== this.data.details.id
        ) {
          // if id changed
          // parents before update
          this.dataColumns._parents = changedProperties.get('data').relations
            ?.parents || [{id: 'dummy', label: 'dummy'}];
          // children before update
          this.dataColumns._children = changedProperties.get('data').relations
            ?.children || [{id: 'dummy', label: 'dummy'}];

          if (this._columns.length === 4) {
            let movement;
            if (this._columns.includes('_parents')) {
              movement = 'left';
            } else if (this._columns.includes('_children')) {
              movement = 'right';
            } else {
              movement = '';
            }

            // hero before update
            if (movement === 'left') {
              this.dataColumns.hero = this.dataColumns._children;
            } else if (movement === 'right') {
              this.dataColumns.hero = this.dataColumns._parents;
            }
          } else {
            this.dataColumns.hero = [
              {
                ...this.data.details,
                leaf:
                  !this.data.relations?.children ||
                  !this.data.relations?.children.length,
                root:
                  !this.data.relations?.parents ||
                  !this.data.relations?.parents.length,
              },
            ];
          }

          this.dataColumns.parents = this.data.relations?.parents || [];
          //children after update
          this.dataColumns.children = this.data.relations?.children || [];
        } else if (
          changedProperties.get('data').details?.id === this.data.details.id
        ) {
          this.dataColumns.hero = [
            {
              ...this.data.details,
              leaf:
                !this.data.relations?.children ||
                !this.data.relations?.children.length,
              root:
                !this.data.relations?.parents ||
                !this.data.relations?.parents.length,
            },
          ];
          this.dataColumns.parents = this.data.relations?.parents || [];
          this.dataColumns.children = this.data.relations?.children || [];
        }
      }

      // do not update columns if only sortOrder has changed
      if (!changedProperties.has('sortOrder')) {
        this.updateComplete.then(() => {
          if (this.data.role === 'children') {
            this.movement = 'left';

            this._columns = ['_parents', 'parents', 'hero', 'children'];
          } else if (this.data.role === 'parents') {
            this.movement = 'right';

            this._columns = ['parents', 'hero', 'children', '_children'];
          }
        });
      }
    }
    if (changedProperties.has('_columns')) {
      this.nodeWidth =
        this.nodeRef.value?.getBoundingClientRect().width -
          (this.nodeRef.value?.getBoundingClientRect().right -
            this.clipRef.value?.getBoundingClientRect().right) || 0;
      this.gap =
        (this.clipRef.value?.getBoundingClientRect().width -
          this.nodeWidth * 3) /
        2;

      this.flexWidth =
        this._columns.length === 4
          ? this.nodeWidth * this._columns.length +
            (this._columns.length - 1) * this.gap +
            'px'
          : '100%';

      this.deltaWidth = this.nodeWidth + this.gap;
    }
  }

  #handleClick(e) {
    if (e.detail.role === 'parents' || e.detail.role === 'children') {
      this.scrolledRect = e.detail?.rect || null;
    }
  }

  updated() {
    if (this.movement === 'left') {
      this.animate = this.flexRef.value.animate(
        [
          {transform: 'translateX(0)'},
          {
            transform: `translateX(${-this.deltaWidth}px)`,
          },
        ],
        this.animationOptions
      );
    } else if (this.movement === 'right') {
      this.animate = this.flexRef.value.animate(
        [
          {
            transform: `translateX(${-this.deltaWidth}px)`,
          },
          {transform: 'translateX(0)'},
        ],
        this.animationOptions
      );
    }

    if (this.animate) {
      this.animate.onfinish = () => {
        this.movement = '';
        this._columns = ['parents', 'hero', 'children'];
        this.animate = null;
      };
    }
  }

  render() {
    return html`
      <div class="clip" ${ref(this.clipRef)}>
        <div
          class="flex"
          @node-clicked=${this.#handleClick}
          style="width: ${this.flexWidth}"
          ${ref(this.flexRef)}
        >
          ${repeat(
            this._columns,
            column => column,
            column => {
              return html`
                <category-browser-column
                  .role="${column}"
                  .nodes="${this.dataColumns[column].length
                    ? this.dataColumns[column]
                    : [{id: 'dummy', label: 'dummy'}]}"
                  ${ref(this.nodeRef)}
                  .heroId="${this.data.details?.id}"
                  .scrolledHeroRect="${this.scrolledRect}"
                  .animationOptions="${this.animationOptions}"
                  .checkedIds="${this.checkedIds}"
                ></category-browser-column>
              `;
            }
          )}
        </div>
      </div>
    `;
  }
}

customElements.define('category-browser-columns', CategoryBrowserColumns);
