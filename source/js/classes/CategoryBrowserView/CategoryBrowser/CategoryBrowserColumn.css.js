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
  }

  .header {
    background-color: var(--color-dark-gray);
    width: var(--column-width);
    display: flex;
    justify-content: space-between;
    color: white;
  }

  .checkbox {
    width: 1rem;
  }

  .label {
    width: 80%;
  }

  .count {
    width: 10%;
  }
  .pvalue {
    flex: 1;
  }
  .mapped {
    flex: 1;
  }
  .drilldown {
    width: 1.6rem;
    height: 1.6rem;
  }

  category-node:part(card) + category-node:part(card) {
    border-top: none;
  }
`;
