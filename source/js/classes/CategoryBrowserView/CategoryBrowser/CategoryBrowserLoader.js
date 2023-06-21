import {LitElement, html, css} from 'lit';

class CategoryLoader extends LitElement {
  static get styles() {
    return css`
      /* Safari */
      @-webkit-keyframes spin {
        0% {
          -webkit-transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
          -webkit-transform: translate(-50%, -50%) rotate(360deg);
        }
      }

      @keyframes spin {
        0% {
          transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
          transform: translate(-50%, -50%) rotate(360deg);
        }
      }

      :host {
        --width: calc((100% - var(--width-category-browser-column)) / 2);
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: var(--z-category-suggestions);
      }

      .loader-container {
        display: block;
        pointer-events: none;
        position: absolute;
        inset: 0;
        left: calc(var(--width) / 2);
        right: calc(var(--width) / 2);
        background-color: var(--color-translucent-lamp-black1);
      }

      .loader {
        position: absolute;
        display: block;
        left: 50%;
        top: 50%;
        width: 2em;
        height: 2em;
        border-radius: 50%;
        background-color: #ffffffee;
        animation: spin 1.2s linear infinite;
      }
      .loader::after {
        content: 'autorenew';
        font-size: 12px;
        font-family: 'Material Icons Outlined';
        text-align: center;
        display: block;
        width: 1.6rem;
        height: 1.6rem;
        line-height: 1.6rem;
        border-radius: 0.8rem;

        position: absolute;
        left: calc(50% - 0.8rem);
        top: calc(50% - 0.8rem);
      }
    `;
  }

  render() {
    return html`
      <div class="loader-container"><div class="loader"></div></div>
    `;
  }
}

customElements.define('category-loader', CategoryLoader);
