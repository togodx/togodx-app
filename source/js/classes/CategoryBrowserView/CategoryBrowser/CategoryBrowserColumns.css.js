import {css} from 'lit';

export const styles = css`
  :host {
    font-size: 10px;
    display: block;
    height: 100%;
    padding: var(--togostanza-canvas-padding);
  }

  .clip {
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .flex {
    height: 100%;
    display: flex;
    flex-direction: row;
  }
`;
