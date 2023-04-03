import {css} from 'lit';

export const styles = css`
  :host {
    --selection-key-bg-color: #ffeda0;
    --selection-mouse-bg-color: #fff6d1;
  }
  .container {
    position: relative;
    overflow: visible;
    z-index: 15;
  }

  .suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    height: 10rem;
    overflow: auto;
    width: 10rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .suggestions > .suggestion {
    padding: 0.2rem;
    cursor: pointer;
  }

  .suggestions > .suggestion.-selected {
    background-color: var(--selection-key-bg-color);
  }

  .suggestions > .suggestion:hover {
    background-color: var(--selection-mouse-bg-color);
  }
`;
