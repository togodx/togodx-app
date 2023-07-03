import {css} from 'lit';

export const styles = css`
  :host {
    display: block;
    position: relative;
    --default-background_color: white;
    --connector-color: var(--color-dark-gray);
    --connector-color-dark: var(--color-gray);
    --border-color: var(--color-dark-gray);
    --node-bg-color: white;
    --leader-top-offset: min(50%, 12px);
    font-family: var(--togostanza-fonts-font_family);
    font-size: calc(var(--togostanza-fonts-font_size_primary) * 1px);
    color: var(--togostanza-fonts-font_color);
  }

  .-hero-right:before {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    border-bottom: 1px solid var(--connector-color);
    top: var(--leader-top-offset);
    box-sizing: border-box;
  }
  .-hero-right.-dark:before {
    border-bottom: 1px solid var(--connector-color-dark);
  }

  .-hero-left:before {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    border-bottom: 1px solid var(--connector-color);
    top: var(--leader-top-offset);
    box-sizing: border-box;
  }

  .-hero-left.-dark:before {
    border-bottom: 1px solid var(--connector-color-dark);
  }

  .-hero-left-1:after {
    position: absolute;
    content: '';
    width: 0px;
    height: 0px;
    border: 8px solid transparent;
    border-left: 8px solid var(--connector-color);
    top: var(--leader-top-offset);
    right: 0;
    transform: translate(50%, -50%) scaleY(0.5);
    box-sizing: border-box;
  }

  .-hero-left-1.-dark:after {
    border-left: 8px solid var(--connector-color-dark);
  }

  .-children-first:before {
    position: absolute;
    content: '';
    width: 1px;
    height: calc(100% - var(--leader-top-offset) + 5px);
    border-left: 1px solid var(--connector-color);
    bottom: -6px;
    box-sizing: border-box;
  }

  .-children-first.-dark:before {
    border-left: 1px solid var(--connector-color-dark);
  }

  .-children-first:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    border-bottom: 1px solid var(--connector-color);
    top: var(--leader-top-offset);
    box-sizing: border-box;
  }

  .-children-first.-dark:after {
    border-bottom: 1px solid var(--connector-color-dark);
  }

  .-children-last:before {
    position: absolute;
    content: '';
    width: 1px;
    height: calc(var(--leader-top-offset) + 6px);
    border-left: 1px solid var(--connector-color);
    top: -6px;
    box-sizing: border-box;
  }

  .-children-last.-dark:before {
    border-left: 1px solid var(--connector-color-dark);
  }

  .-children-last:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    border-top: 1px solid var(--connector-color);
    top: var(--leader-top-offset);
    box-sizing: border-box;
  }

  .-children-last.-dark:after {
    border-top: 1px solid var(--connector-color-dark);
  }

  .-children-mid:before {
    position: absolute;
    content: '';
    width: 1px;
    height: calc(100% + 14px);
    border-left: 1px solid var(--connector-color);
    top: -6px;
    box-sizing: border-box;
  }

  .-children-mid.-dark:before {
    border-left: 1px solid var(--connector-color-dark);
  }

  .-children-mid:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    border-bottom: 1px solid var(--connector-color);
    top: var(--leader-top-offset);
    box-sizing: border-box;
  }

  .-children-mid.-dark:after {
    border-bottom: 1px solid var(--connector-color-dark);
  }

  .-parents-first:before {
    position: absolute;
    content: '';
    width: 1px;
    height: calc(100% - var(--leader-top-offset) + 5px);
    border-right: 1px solid var(--connector-color);
    bottom: -6px;
    right: 0;
    box-sizing: border-box;
  }

  .-parents-first.-dark:before {
    border-right: 1px solid var(--connector-color-dark);
  }

  .-parents-first:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    border-bottom: 1px solid var(--connector-color);
    top: var(--leader-top-offset);
    box-sizing: border-box;
  }

  .-parents-first.-dark:after {
    border-bottom: 1px solid var(--connector-color-dark);
  }

  .-parents-last:before {
    position: absolute;
    content: '';
    width: 1px;
    height: calc(var(--leader-top-offset) + 6px);
    border-right: 1px solid var(--connector-color);
    top: -6px;
    right: 0;
    box-sizing: border-box;
  }

  .-parents-last.-dark:before {
    border-right: 1px solid var(--connector-color-dark);
  }

  .-parents-last:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    border-top: 1px solid var(--connector-color);
    top: var(--leader-top-offset);
    box-sizing: border-box;
  }

  .-parents-last.-dark:after {
    border-top: 1px solid var(--connector-color-dark);
  }

  .-parents-mid:before {
    position: absolute;
    content: '';
    width: 1px;
    height: calc(100% + 14px);
    border-right: 1px solid var(--connector-color);
    top: -6px;
    right: 0;
    box-sizing: border-box;
  }

  .-parents-mid.-dark:before {
    border-right: 1px solid var(--connector-color-dark);
  }

  .-parents-mid:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    border-bottom: 1px solid var(--connector-color);
    top: var(--leader-top-offset);
    box-sizing: border-box;
  }

  .-parents-mid.-dark:after {
    border-bottom: 1px solid var(--connector-color-dark);
  }

  .-parents-single:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    border-bottom: 1px solid var(--connector-color);
    top: var(--leader-top-offset);
    box-sizing: border-box;
  }

  .-parents-single.-dark:after {
    border-bottom: 1px solid var(--connector-color-dark);
  }

  .-children-single:before {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    border-bottom: 1px solid var(--connector-color);
    top: var(--leader-top-offset);
    box-sizing: border-box;
  }

  .-children-single.-dark:before {
    border-bottom: 1px solid var(--connector-color-dark);
  }

  .ontology-card {
    padding: var(--node-padding-y) var(--node-padding-x);
    font-family: var(--togostanza-font-family);
    border: 1px solid var(--border-color);
    background-color: var(--node-bg-color);
    cursor: pointer;
    position: relative;
    width: var(--width-category-browser-column);
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5em;
    margin-bottom: -1px;
  }

  .ontology-card-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    gap: var(--column-gap);
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
  }
  .checkbox-container > input[type='checkbox'] {
    cursor: pointer;
    width: 100%;
    height: 100%;
    margin: 0;
  }

  .label {
    flex: 1;
    overflow-wrap: break-word;
    word-break: break-word;
    overflow-wrap: anywhere;
    hyphens: auto;
  }

  .count,
  .mapped,
  .pvalue {
    text-align: right;
  }

  .mapped,
  .pvalue {
    display: none;
  }

  .-user-filter-set {
    display: block;
  }

  .ontology-card-content > .drilldown {
    width: 1.6rem;
    height: 1.6rem;
  }

  .ontology-card {
    position: relative;
  }
  .ontology-card:hover::before {
    content: '';
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-selected-translucent);
    pointer-events: none;
  }

  .ontology-card.-greyedout {
    opacity: 0.25;
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
    top: var(--leader-top-offset);
    left: 0;
    transform: translate(-50%, -50%) scaleY(0.5);
    box-sizing: border-box;
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

  .hidden {
    visibility: hidden;
  }

  .hero-list {
    padding-inline-start: 0.2rem;
    margin: 0;
  }

  .hero-list li {
    margin-left: 0.5rem;
  }

  .-haschild > .drilldown {
    position: relative;
    cursor: pointer;
    width: 1.6rem;
    height: 1.6rem;
  }
  .-haschild > .drilldown::before,
  .-haschild > .drilldown::after {
    content: '';
    position: absolute;
    display: block;
  }
  .-haschild > .drilldown::before {
    width: 1rem;
    height: 1rem;
    border-radius: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .-haschild > .drilldown::after {
    border-style: solid;
    border-width: 0.3rem 0 0.3rem 0.4rem;
    border-color: transparent transparent transparent var(--color-lamp-black);
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
  }
  .-haschild > .drilldown:hover::before {
    background-color: var(--color-lamp-black);
  }
  .-haschild > .drilldown:hover::after {
    border-color: transparent transparent transparent white;
  }

  .-selected > .drilldown::before {
    background-color: var(--color-lamp-black);
  }
  .-selected > .drilldown::after {
    border-color: transparent transparent transparent white;
  }
`;
