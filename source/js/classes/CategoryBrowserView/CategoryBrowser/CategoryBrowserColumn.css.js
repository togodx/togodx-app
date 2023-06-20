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
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(var(--togostanza-outline-height) - var(--history-height));
  }

  .header-container {
    position: sticky;
    display: flex;
    justify-content: space-between;
    align-items: center;
    top: 0;
    background-color: var(--color-gray);
    z-index: var(--z-category-column-header);
    --width-side: calc((100% - var(--width-category-browser-column)) / 2);
    transition: background-color var(--transition-wipe);
  }

  .header-container.-dark {
    background-color: var(--bg-color-dark);
    transition: background-color var(--transition-wipe);
  }

  .header-container.-dark::before {
    background-color: var(--color-dark-gray);
    transition: background-color var(--transition-wipe);
  }

  .header-container.-dark::after {
    background-color: var(--color-dark-gray);
    transition: background-color var(--transition-wipe);
  }

  .header-container::before {
    content: '';
    position: absolute;
    width: calc(var(--width-side) / 2);
    height: 100%;
    left: calc(var(--width-side) / 2);
    background-color: var(--color-lighter-gray);
    transition: background-color var(--transition-wipe);
  }
  .header-container::after {
    content: '';
    position: absolute;
    width: calc(var(--width-side) / 2);
    height: 100%;
    right: calc(var(--width-side) / 2);
    background-color: var(--color-lighter-gray);
    transition: background-color var(--transition-wipe);
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
