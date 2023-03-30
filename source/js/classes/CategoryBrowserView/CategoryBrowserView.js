import {css, html, LitElement} from 'lit';
import './Suggest/Suggest';
import './CategoryBrowser/CategoryBrowser';
import './CategoryBrowser/CategoryBrowserColumns';
import './CategoryBrowser/CategoryBrowserColumn';
import './CategoryBrowser/CategoryBrowserError';
import './CategoryBrowser/CategoryBrowserNode';

export class CategoryBrowserView extends LitElement {
  #attribute;
  #items;

  constructor(element, attribute, items) {
    super();

    this.#attribute = attribute;
    this.#items = items;

    element.append(this);
  }

  static get styles() {
    return css`
      :host {
        position: absolute;
        inset: 0;
      }
      .container {
        display: flex;
        flex-direction: column;
        gap: 5px;
        height: 100%;
        padding: 5px;
      }

      .suggest {
        height: 20px;
      }
      .category-browser {
        position: relative;
        flex: 1;
      }
    `;
  }

  static get properties() {
    return {};
  }

  render() {
    return html`
      <div class="container">
        <div class="suggest">
          <suggest id="suggest"></suggest>
        </div>
        <div class="category-browser">
          <category-browser
            id="category-browser"
            .attribute=${this.#attribute}
            .items=${this.#items}
          ></category-browser>
        </div>
      </div>
    `;
  }
}

customElements.define('category-browser-view', CategoryBrowserView);
