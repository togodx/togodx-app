import {css} from 'lit';

export const styles = css`
  :host {
    display: block;
    height: 100%;
    width: 100%;
    position: absolute;
    inset: 0;
    --column-width: 30rem;
    --label-width: 70%;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 5px;
    height: 100%;
  }

  ontology-error {
    z-index: 11;
  }
`;
