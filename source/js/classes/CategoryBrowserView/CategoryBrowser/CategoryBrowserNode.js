import {LitElement, html, nothing} from 'lit';
import {ref, createRef} from 'lit/directives/ref.js';
import {styles} from './CategoryBrowserNode.css';

export class CategoryNode extends LitElement {
  #greyedOut = false;

  static get styles() {
    return styles;
  }

  static get properties() {
    return {
      data: {type: Object, state: true},
      userFiltersSet: {type: Boolean, state: true},
      checked: {type: Boolean, state: true},
      hidden: {type: Boolean, attribute: true},
      id: {type: String, attribute: true, reflect: true},
      mode: {
        type: String,
        state: true,
      },
      order: {
        type: String,
        state: true,
      },
      prevRect: {
        type: Object,
        state: true,
      },
      content: {
        type: Object,
        state: true,
      },
    };
  }

  shouldUpdate() {
    if (this.data.id === 'dummy') {
      this.hidden = true;
    } else {
      this.hidden = false;
    }
    return true;
  }

  constructor() {
    super();
    this.data = {};
    this.hidden = false;
    this.mode = '';
    this.order = '';
    this.prevRect = {x: 0, y: 0, width: 0, height: 0};
    this._skipKeys = ['label', 'children', 'parents', 'leaf', 'root'];
    this.nodeRef = createRef();
    this._leftCoinnector = createRef;
    this.leftConnectorClassName = '';
    this.rightConnectorClassName = '';
    this.content = {};
    this.userFiltersSet = false;
    this.checked = false;
  }

  willUpdate(prevParams) {
    if (this.mode === 'hero') {
      // do not display connection liner to right of hero node without children and to left of hero node without parents
      if (this.data.leaf) {
        this.leftConnectorClassName = '-hero-left';
      } else if (this.data.root) {
        this.rightConnectorClassName = '-hero-right';
      } else {
        this.leftConnectorClassName = `-hero-left`;
        this.rightConnectorClassName = `-hero-right`;
      }
    } else if (this.mode === 'children') {
      this.leftConnectorClassName = `-${this.mode}-${this.order}`;
    } else if (this.mode === 'parents') {
      this.rightConnectorClassName = `-${this.mode}-${this.order}`;
    }

    this.prevMode = prevParams.get('mode');
    if (this.data.id === 'dummy') {
      this.leftConnectorClassName = '';
      this.rightConnectorClassName = '';
    }
    this.#greyedOut = !this.data.pvalue && this.userFiltersSet;

    if (prevParams.has('checked')) {
      console.log('checked changed', this.data.label, this.checked);
    }
  }

  updated() {
    const animProps = {
      duration: 500,
      easing: 'ease-out',
    };
    if (this.mode === 'hero') {
      const animation = [
        {
          height: `${this.prevRect?.height || 0}px`,
          overflow: 'hidden',
        },
        {
          height: `${
            this.nodeRef?.value.getBoundingClientRect().height || 0
          }px`,
        },
      ];

      animation[0].backgroundColor = this.defaultBgColor;
      animation[1].backgroundColor = this.selectedBgColor;

      this.nodeRef.value.animate(animation, animProps);
    }
  }

  firstUpdated() {
    this.defaultBgColor = getComputedStyle(this.nodeRef.value).getPropertyValue(
      '--default-background_color'
    );
    this.selectedBgColor = getComputedStyle(
      this.nodeRef.value
    ).getPropertyValue('--selected-background_color');
  }

  #handleClick() {
    if (this.#greyedOut) return;
    this.dispatchEvent(
      new CustomEvent('node-clicked', {
        detail: {
          rect: this.nodeRef.value.getBoundingClientRect(),
          role: this.mode,
          ...this.data,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  #handleCheckboxChange = e => {
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent('node-checked', {
        detail: {id: this.data.id, checked: e.target.checked},
        bubbles: true,
        composed: true,
      })
    );
  };

  render() {
    return html`
      <div class="card-container">
        <div class="connector ${this.leftConnectorClassName}"></div>
        <div
          ${ref(this.nodeRef)}
          class="ontology-card ${this.hidden ? 'hidden' : ''} ${this.mode ===
          'hero'
            ? 'selected'
            : ''} ${this.mode === 'children' ? 'children-arrow' : ''} 
            ${this.#greyedOut ? '-greyedout' : ''}"
          style=${!this.#greyedOut
            ? `background-color: ${this.data.color}`
            : ''}
          part="card"
        >
          ${this.data.id !== 'root'
            ? html`<div class="checkbox-container">
                ${this.checked
                  ? html`<input
                      type="checkbox"
                      checked
                      @change=${this.#handleCheckboxChange}
                    />`
                  : html`<input
                      type="checkbox"
                      @change=${this.#handleCheckboxChange}
                    />`}
              </div>`
            : nothing}

          <div
            class="ontology-card-content ${!this.data.tip ? '-haschild' : ''}"
            @click=${this.#handleClick}
          >
            <div class="label">${this.data.label}</div>
            <div class="count">${this.data.count.toLocaleString()}</div>
            <div class="mapped">${this.data.mapped?.toLocaleString()}</div>
            <div class="pvalue">${this.data.pvalue?.toExponential(2)}</div>
            <div class="drilldown"></div>
          </div>
        </div>
        <div class="connector ${this.rightConnectorClassName}"></div>
      </div>
    `;
  }
}

customElements.define('category-node', CategoryNode);