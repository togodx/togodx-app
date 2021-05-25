import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";
import ConditionBuilder from "./ConditionBuilder";
import Color from "./Color";
import * as event from '../events';

const MIN_PIN_SIZE = 12;
const MAX_PIN_SIZE = 36;
const RANGE_PIN_SIZE = MAX_PIN_SIZE - MIN_PIN_SIZE;

export default class TrackOverviewCategorical {

  #subject;
  #property;
  #values;
  #ROOT;

  constructor(elm, subject, property, values) {

    this.#ROOT = elm;
    this.#subject = subject;
    this.#property = property;
    this.#values = values.map(value => Object.assign({}, value));

    // make overview
    // TODO: ヒストグラムは別処理
    const sum = values.reduce((acc, value) => acc + value.count, 0);
    const width = 100 / values.length;
    elm.innerHTML = this.#values.map((value, index) => {
      value.countLog10 = value.count === 0 ? 0 : Math.log10(value.count);
      value.width = value.count / sum * 100;
      value.baseColor = subject.color.mix(new Color('hsv', [360 * index / values.length, 70, 50]), .2).to('srgb').set({lightness: lightness => lightness * 1.2});
      return `
        <li class="track-value-view" style="width: ${width}%;" data-category-id="${value.categoryId}">
          <p>
            <span class="label">${value.label}</span>
            <span class="count">${value.count.toLocaleString()}</span>
          </p>
          <div class="pin"></div>
        </li>`;
    }).join('');

    elm.querySelectorAll(':scope > .track-value-view').forEach((elm, index) => {

      // reference
      const value = this.#values[index];
      value.elm = elm;
      const pin = elm.querySelector(':scope > .pin');
      value.pin = pin;

      // attach event: show tooltip
      const label = `<span style="color: ${this.#subject.colorCSSValue}">${value.label}</span>`;
      elm.addEventListener('mouseenter', () => {
        const customEvent = new CustomEvent(event.enterPropertyValueItemView, {detail: {
          label,
          values: [
            {
              key: 'Count',
              value: value.count.toLocaleString()
            }
          ],
          elm
        }});
        DefaultEventEmitter.dispatchEvent(customEvent);
      });
      elm.addEventListener('mouseleave', () => {
        const customEvent = new CustomEvent(event.leavePropertyValueItemView);
        DefaultEventEmitter.dispatchEvent(customEvent);
      });

      // attach event: show tooltip of pin
      pin.addEventListener('mouseenter', () => {
        const customEvent = new CustomEvent(event.enterPropertyValueItemView, {detail: {
          label,
          values: [
            {
              key: 'Count',
              value: `${value.userValueCount.toLocaleString()} / ${value.count.toLocaleString()}`
            }
          ],
          elm: pin
        }});
        DefaultEventEmitter.dispatchEvent(customEvent);
      });
      pin.addEventListener('mouseleave', () => {
        const customEvent = new CustomEvent(event.leavePropertyValueItemView);
        DefaultEventEmitter.dispatchEvent(customEvent);
      });

      // attach event: select/deselect a value
      elm.addEventListener('click', () => {
        if (elm.classList.contains('-selected')) {
          elm.classList.remove('-selected');
          ConditionBuilder.removePropertyValue(this.#property.propertyId, value.categoryId);
        } else {
          elm.classList.add('-selected');
          ConditionBuilder.addPropertyValue({
            subject: this.#subject,
            property: this.#property,
            value: {
              categoryId: value.categoryId,
              label: value.label,
              count: value.count,
              ancestors: []
            }
          });
        }
      });
    });

    // event listener
    DefaultEventEmitter.addEventListener(event.mutatePropertyValueCondition, e => {
      let propertyId, categoryId;
      switch (e.detail.action) {
        case 'add':
          propertyId = e.detail.condition.property.propertyId;
          categoryId = e.detail.condition.value.categoryId;
          break;
        case 'remove':
          propertyId = e.detail.propertyId;
          categoryId = e.detail.categoryId;
          break;
      }
      if (this.#property.propertyId === propertyId) {
        this.#values.forEach(value => {
          if (value.categoryId === categoryId) {
            switch (e.detail.action) {
              case 'add':
                value.elm.classList.add('-selected');
                break;
              case 'remove':
                value.elm.classList.remove('-selected');
                break;
            }
          }
        });
      }
    });
    DefaultEventEmitter.addEventListener(event.changeViewModes, e => this.#update(e.detail));
    DefaultEventEmitter.addEventListener(event.setUserValues, e => this.#plotUserIdValues(e.detail));
    DefaultEventEmitter.addEventListener(event.clearUserValues, e => this.#clearUserIdValues(e.detail));

    this.#update(App.viewModes);
  }

  #update(viewModes) {
    const isArea = viewModes.area;
    const isLog10 = viewModes.log10;
    const sum = this.#values.reduce((acc, value) => acc + (isLog10 ? value.countLog10 : value.count), 0);
    let max = Math.max(...this.#values.map(value => value.count));
    max = isLog10 ? Math.log10(max) : max;
    const fixedWidth = isArea ? 0 : 100 / this.#values.length;
    let left = 0;
    this.#values.forEach(value => {
      const width = isArea ? (isLog10 ? Math.log10(value.count) : value.count) / sum * 100 : fixedWidth;
      value.elm.style.backgroundColor = `rgb(${value.baseColor.mix(App.colorLampBlack, 1 - (isLog10 ? value.countLog10 : value.count) / max).coords.map(cood => cood * 256).join(',')})`;
      value.elm.style.width = width + '%';
      value.elm.style.left = left + '%';
      left += width;
    });
  }

  #plotUserIdValues(detail) {
    if (this.#property.propertyId === detail.propertyId) {
      this.#ROOT.classList.add('-pinsticking');

      console.log(detail, this.#values)

      this.#values.forEach(value => {
        const userValue = detail.values.find(userValue => userValue.categoryId === value.categoryId);
        if (userValue) {
          value.elm.classList.add('-pinsticking');
          // pin
          let ratio = userValue.count / value.count;
          ratio = ratio > 1 ? 1 : ratio;
          const size = MIN_PIN_SIZE + RANGE_PIN_SIZE * ratio;
          value.pin.style.width = size + 'px';
          value.pin.style.height = size + 'px';
          value.pin.style.top = -size + 'px';
          value.pin.style.left = (-size / 2) + 'px';
          value.userValueCount =  userValue.count;
        } else {
          value.elm.classList.remove('-pinsticking');
        }
      });
    }
  }

  #clearUserIdValues() {
    this.#values.forEach(value => value.elm.classList.remove('-pinsticking'));
  }

}
