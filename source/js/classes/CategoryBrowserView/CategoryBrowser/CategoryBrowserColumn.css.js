import {css} from 'lit';

export const styles = css`
  :host {
    flex-grow: 1;
    flex-basis: 0;
    display: block;
    position: relative;
  }

  .column {
    height: 100%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(var(--togostanza-outline-height) - var(--history-height));
  }

  .header-container {
    position: sticky;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    background-color: var(--color-gray);
    width: 100%;
  }

  .header {
    width: min(85%, 20rem);
    display: flex;
    justify-content: space-between;
    color: white;
  }

  .header > .values {
    width: 70%;
    margin-left: 6px;
  }
  .header > .total {
    width: 20%;
    margin-right: 6px;
  }

  category-node:part(card) + category-node:part(card) {
    border-top: none;
  }
`;
