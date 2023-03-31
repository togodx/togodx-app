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
    width: min(85%, 20rem);
    max-width: 20rem;
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

  .ontology-card-content > .label {
    width: 70%;
  }
  .ontology-card-content > .count {
    width: 20%;
  }
  .ontology-card-content > .p-value {
    width: 20%;
  }

  .ontology-card:hover {
    filter: brightness(90%);
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
`;