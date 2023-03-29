import {LitElement, html, css, nothing} from 'lit';
import {ref, createRef} from 'lit/directives/ref.js';

export class CategoryCard extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
        --default-background_color: white;
        --connector-color: black;
        --border-color: #ccc;
        --node-bg-color: white;
        font-family: var(--togostanza-fonts-font_family);
        font-size: calc(var(--togostanza-fonts-font_size_primary) * 1px);
        color: var(--togostanza-fonts-font_color);
      }

      .-hero-right:before {
        position: absolute;
        z-index: 9;
        content: '';
        width: 100%;
        height: 1px;
        border-bottom: 1px solid var(--connector-color);
        top: min(50%, 15px);
        box-sizing: border-box;
      }

      .-hero-left:before {
        position: absolute;
        z-index: 9;
        content: '';
        width: 100%;
        height: 1px;
        border-bottom: 1px solid var(--connector-color);
        top: min(50%, 15px);
        box-sizing: border-box;
      }

      .-hero-left-1:after {
        position: absolute;
        content: '';
        width: 0px;
        height: 0px;
        border: 8px solid transparent;
        border-left: 8px solid var(--connector-color);
        top: min(50%, 15px);
        right: 0;
        transform: translate(50%, -50%) scaleY(0.5);
        box-sizing: border-box;
        z-index: 9;
      }

      .-children-first:before {
        position: absolute;
        z-index: 9;
        content: '';
        width: 1px;
        height: calc(100% - min(50%, 15px) + 5px);
        border-left: 1px solid var(--connector-color);
        bottom: -6px;
        box-sizing: border-box;
      }

      .-children-first:after {
        position: absolute;
        z-index: 9;
        content: '';
        width: 100%;
        height: 1px;
        border-bottom: 1px solid var(--connector-color);
        top: min(50%, 15px);
        box-sizing: border-box;
      }

      .-children-last:before {
        position: absolute;
        z-index: 9;
        content: '';
        width: 1px;
        height: calc(min(50%, 15px) + 6px);
        border-left: 1px solid var(--connector-color);
        top: -6px;
        box-sizing: border-box;
      }

      .-children-last:after {
        position: absolute;
        z-index: 9;
        content: '';
        width: 100%;
        height: 1px;
        border-top: 1px solid var(--connector-color);
        top: min(50%, 15px);
        box-sizing: border-box;
      }

      .-children-mid:before {
        position: absolute;
        z-index: 9;
        content: '';
        width: 1px;
        height: calc(100% + 14px);
        border-left: 1px solid var(--connector-color);
        top: -6px;
        box-sizing: border-box;
      }

      .-children-mid:after {
        position: absolute;
        z-index: 9;
        content: '';
        width: 100%;
        height: 1px;
        border-bottom: 1px solid var(--connector-color);
        top: min(50%, 15px);
        box-sizing: border-box;
      }

      .-parents-first:before {
        position: absolute;
        z-index: 9;
        content: '';
        width: 1px;
        height: calc(100% - min(50%, 15px) + 5px);
        border-right: 1px solid var(--connector-color);
        bottom: -6px;
        right: 0;
        box-sizing: border-box;
      }

      .-parents-first:after {
        position: absolute;
        z-index: 9;
        content: '';
        width: 100%;
        height: 1px;
        border-bottom: 1px solid var(--connector-color);
        top: min(50%, 15px);
        box-sizing: border-box;
      }

      .-parents-last:before {
        position: absolute;
        z-index: 9;
        content: '';
        width: 1px;
        height: calc(min(50%, 15px) + 6px);
        border-right: 1px solid var(--connector-color);
        top: -6px;
        right: 0;
        box-sizing: border-box;
      }

      .-parents-last:after {
        position: absolute;
        z-index: 9;
        content: '';
        width: 100%;
        height: 1px;
        border-top: 1px solid var(--connector-color);
        top: min(50%, 15px);
        box-sizing: border-box;
      }

      .-parents-mid:before {
        position: absolute;
        z-index: 9;
        content: '';
        width: 1px;
        height: calc(100% + 14px);
        border-right: 1px solid var(--connector-color);
        top: -6px;
        right: 0;
        box-sizing: border-box;
      }

      .-parents-mid:after {
        position: absolute;
        z-index: 9;
        content: '';
        width: 100%;
        height: 1px;
        border-bottom: 1px solid var(--connector-color);
        top: min(50%, 15px);
        box-sizing: border-box;
      }

      .-parents-single:after {
        position: absolute;
        z-index: 9;
        content: '';
        width: 100%;
        height: 1px;
        border-bottom: 1px solid var(--connector-color);
        top: min(50%, 15px);
        box-sizing: border-box;
      }

      .-children-single:before {
        position: absolute;
        z-index: 9;
        content: '';
        width: 100%;
        height: 1px;
        border-bottom: 1px solid var(--connector-color);
        top: min(50%, 15px);
        box-sizing: border-box;
      }

      .ontology-card {
        padding: 3px 6px;
        font-family: var(--togostanza-font-family);
        border: 1px solid var(--border-color);
        background-color: var(--node-bg-color);
        cursor: pointer;
        position: relative;
        width: min(85%, 20rem);
        max-width: 20rem;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .ontology-card > .label {
        width: 70%;
      }
      .ontology-card > .count {
        width: 20%;
      }
      .ontology-card > .p-value {
        width: 20%;
      }

      .ontology-card:hover {
        background-color: var(--togostanza-node-hover_background_color);
        border-color: var(--togostanza-node-selected_border_color);
      }

      .children-arrow {
        overflow: visible;
      }

      .children-arrow-1:before {
        position: absolute;
        content: '';
        width: 0px;
        height: 0px;
        border: 8px solid transparent;
        border-left: 8px solid var(--border-color);
        top: min(50%, 15px);
        left: 0;
        transform: translate(-50%, -50%) scaleY(0.5);
        box-sizing: border-box;
        z-index: 9;
      }

      h3 {
        display: inline;
        margin: 0;
        font-size: calc(var(--togostanza-fonts-font_size_primary) * 1px);
      }

      .card-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
      }

      .connector {
        position: relative;
        flex-grow: 1;
      }

      .selected {
        background-color: var(--togostanza-node-selected_background_color);
        border-color: var(--togostanza-node-selected_border_color);
      }

      .hidden {
        visibility: hidden;
      }

      .table-container {
        overflow-y: auto;
        margin-top: 2px;
      }

      .hero-list {
        padding-inline-start: 0.2rem;
        margin: 0;
      }

      .hero-list li {
        margin-left: 0.5rem;
      }

      table {
        width: 100%;
        max-width: 10rem;
        table-layout: fixed;
        font-size: calc(var(--togostanza-fonts-font_size_secondary) * 1px);
        border-spacing: 0;
        opacity: 0.7;
      }

      table th,
      table td {
        padding-top: 3px;
      }

      table th.key {
        vertical-align: top;
        text-align: left;
        padding-right: 0.8em;
      }

      table td.data {
        overflow: auto;
        display: inline-block;
      }
    `;
  }

  static get properties() {
    return {
      data: {type: Object, state: true},
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
    this.cardRef = createRef();
    this._leftCoinnector = createRef;
    this.leftConnectorClassName = '';
    this.rightConnectorClassName = '';
    this.content = {};
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

    if (this.data) {
      console.log({data: this.data});
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
            this.cardRef?.value.getBoundingClientRect().height || 0
          }px`,
        },
      ];

      animation[0].backgroundColor = this.defaultBgColor;
      animation[1].backgroundColor = this.selectedBgColor;

      this.cardRef.value.animate(animation, animProps);
    }
  }

  firstUpdated() {
    this.defaultBgColor = getComputedStyle(this.cardRef.value).getPropertyValue(
      '--default-background_color'
    );
    this.selectedBgColor = getComputedStyle(
      this.cardRef.value
    ).getPropertyValue('--selected-background_color');
  }

  render() {
    return html`
      <div class="card-container">
        <div class="connector ${this.leftConnectorClassName}"></div>
        <div
          ${ref(this.cardRef)}
          class="ontology-card ${this.hidden ? 'hidden' : ''} ${this.mode ===
          'hero'
            ? 'selected'
            : ''} ${this.mode === 'children' ? 'children-arrow' : ''}"
        >
          <div class="label">${this.data.label}</div>
          <div class="count">${this.data.count}</div>
        </div>
        <div class="connector ${this.rightConnectorClassName}"></div>
      </div>
    `;
  }
}

customElements.define('category-card', CategoryCard);
