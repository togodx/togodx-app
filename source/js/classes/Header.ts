import DefaultEventEmitter from './DefaultEventEmitter.ts';
import * as events from '../events.js';
import { PresetMetaDatum } from '../interfaces.ts';

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
    console.log(event)
    console.log(event.detail)
    const presets: PresetMetaDatum[] = event.detail;
    const li = this.#MAIN_MENU.querySelector(':scope > ul > li:nth-child(1') as HTMLUListElement;
    console.log(li)
    const ul = document.createElement('ul')
    ul.innerHTML = presets.map(preset => `
      <li data-url="${preset.url}">
        <dl>
          <dt>${preset.label}</dt>
          <dd>${preset.description}</dd>
        </dl>
      </li>
    `).join('');
    li.append(ul)

  }
}
