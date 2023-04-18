import {css} from 'lit';

export const styles = css`
  :host {
    display: block;
    position: relative;
    --default-background_color: white;
    --connector-color: var(--color-dark-gray);
    --border-color: var(--color-dark-gray);
    --node-bg-color: white;
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
    top: min(50%, 15px);
    box-sizing: border-box;
  }

  .-hero-left:before {
    position: absolute;
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
  }

  .-children-first:before {
    position: absolute;
    content: '';
    width: 1px;
    height: calc(100% - min(50%, 15px) + 5px);
    border-left: 1px solid var(--connector-color);
    bottom: -6px;
    box-sizing: border-box;
  }

  .-children-first:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    border-bottom: 1px solid var(--connector-color);
    top: min(50%, 15px);
    box-sizing: border-box;
  }

  .-children-last:before {
    position: absolute;
    content: '';
    width: 1px;
    height: calc(min(50%, 15px) + 6px);
    border-left: 1px solid var(--connector-color);
    top: -6px;
    box-sizing: border-box;
  }

  .-children-last:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    border-top: 1px solid var(--connector-color);
    top: min(50%, 15px);
    box-sizing: border-box;
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

  .-children-mid:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    border-bottom: 1px solid var(--connector-color);
    top: min(50%, 15px);
    box-sizing: border-box;
  }

  .-parents-first:before {
    position: absolute;
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
    content: '';
    width: 100%;
    height: 1px;
    border-bottom: 1px solid var(--connector-color);
    top: min(50%, 15px);
    box-sizing: border-box;
  }

  .-parents-last:before {
    position: absolute;
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
    content: '';
    width: 100%;
    height: 1px;
    border-top: 1px solid var(--connector-color);
    top: min(50%, 15px);
    box-sizing: border-box;
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

  .-parents-mid:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    border-bottom: 1px solid var(--connector-color);
    top: min(50%, 15px);
    box-sizing: border-box;
  }

  .-parents-single:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    border-bottom: 1px solid var(--connector-color);
    top: min(50%, 15px);
    box-sizing: border-box;
  }

  .-children-single:before {
    position: absolute;
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
    width: var(--column-width);
    max-width: 25rem;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5em;
  }

  .ontology-card-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    position: relative;
  }
  .checkbox-container > input[type='checkbox'] {
    cursor: pointer;
    position: absolute;
    inset: 0;
    margin: 0;
  }

  .label {
    flex: 1;
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
  }

  .ontology-card.-greyedout {
    background-color: #ccc;
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
