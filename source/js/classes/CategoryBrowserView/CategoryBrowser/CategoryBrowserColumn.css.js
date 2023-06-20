import {css} from 'lit';

export const styles = css`
  :host {
    flex-grow: 1;
    flex-basis: 0;
    display: block;
    position: relative;
    --column-gap: 0.5em;
    --node-padding-x: 6px;
    --node-padding-y: 3px;
    --bg-color-dark: #292929;
  }

  .column {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(var(--togostanza-outline-height) - var(--history-height));
  }

  .clipping-mask {
    height: 100%;
    overflow: auto;
  }

  .header-container {
    position: sticky;
    display: flex;
    justify-content: space-between;
    align-items: center;
    top: 0;
  }

  .header {
    background-color: var(--color-dark-gray);
    width: var(--width-category-browser-column);
    display: flex;
    justify-content: space-between;
    color: white;
    gap: var(--column-gap);
  }

  .checkbox {
    width: 1rem;
    margin-left: var(--node-padding-x);
  }

  .drilldown {
    margin-right: var(--node-padding-x);
  }

  category-browser-sorter {
    display: flex;
    justify-content: flex-end;
  }

  category-browser-sorter.label {
    flex: 1;
    justify-content: flex-start;
  }

  .pvalue,
  .mapped {
    display: none;
  }

  .-user-filter-set {
    display: flex;
  }

  .drilldown {
    width: 1.6rem;
    height: 1.6rem;
  }

  category-node:part(card) + category-node:part(card) {
    border-top: none;
  }
`;
