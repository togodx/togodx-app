import {css} from 'lit';

export const styles = css`
  .column-sorter-container {
    width: fit-content;
    cursor: pointer;
    padding: var(--node-padding-y) 0;
    padding-left: 0.2rem;
  }
  .column-sorter-container:hover {
    background-color: var(--color-lamp-black);
    transition: background-color var(--transition-instant);
  }

  .sorter {
    display: inline-block;
    width: 1.2rem;
    height: 1.2rem;
    position: relative;
    top: -0.1rem;
    vertical-align: middle;
    pointer-events: none;
    cursor: pointer;
  }

  .sorter::before,
  .sorter::after {
    content: '';
    position: absolute;
    left: 0.3rem;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    opacity: 0.4;
  }

  .sorter::before {
    border-width: 0 0.3rem 0.3rem 0.3rem;
    border-color: transparent transparent white transparent;
    top: 0.2rem;
  }

  .sorter::after {
    border-width: 0.3rem 0.3rem 0 0.3rem;
    border-color: white transparent transparent transparent;
    bottom: 0.2rem;
  }
`;
