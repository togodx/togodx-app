import DefaultEventEmitter from './DefaultEventEmitter.ts';
import * as events from '../events.js';
import { PresetMetaDatum } from '../interfaces.ts';
import PresetManager from './PresetManager.ts';

export default class Header {
  #MAIN_MENU: HTMLElement;

  constructor(elm: HTMLElement) {
    console.log(this, elm);

    // references
    this.#MAIN_MENU = elm.querySelector(':scope > .mainmenu') as HTMLElement;

    // event listener
    DefaultEventEmitter.addEventListener(
      events.loadedPresets,
      <EventListener>this.#loadedPresets.bind(this)
    );
    
  }

  #loadedPresets(event: CustomEvent): void {
    const presets: PresetMetaDatum[] = event.detail;
    // make menu
    const li = this.#MAIN_MENU.querySelector(':scope > ul > li:nth-child(1)') as HTMLUListElement;
    const ul = document.createElement('ul');
    li.append(ul);
    const lis = presets.map(preset => {
      const li = document.createElement('li');
      li.innerHTML = `
        <dl>
          <dt>${preset.label}</dt>
          <dd>${preset.description}</dd>
        </dl>`;
      li.addEventListener('click', () => PresetManager.loadAttributeSet(preset.url));
      return li;
    });
    ul.append(...lis);
  }
}
