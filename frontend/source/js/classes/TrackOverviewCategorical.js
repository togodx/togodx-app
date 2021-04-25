import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";
import ConditionBuilder from "./ConditionBuilder";
import {EVENT_setUserValues, EVENT_changeViewModes, EVENT_enterPropertyValueItemView, EVENT_mutatePropertyValueCondition, EVENT_stickUserValue, EVENT_leavePropertyValueItemView} from '../events';

const MIN_PIN_SIZE = 8;
const MAX_PIN_SIZE = 20;
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
      value.color = `hsla(${360 * index / values.length}, 70%, 50%, .075)`;
      return `
        <li class="track-value-view" style="width: ${width}%;" data-category-id="${value.categoryId}">
          <div class="color" style="background-color: ${value.color};"></div>
          <div class="heatmap"></div>
          <p>
            <span class="label">${value.label}</span>
            <span class="count">${value.count.toLocaleString()}</span>
          </p>
          <div class="pin"></div>
        </li>`;
    }).join('');

    elm.querySelectorAll(':scope > .track-value-view').forEach((valueElm, index) => {

      // reference
      this.#values[index].elm = valueElm;
      this.#values[index].pin = valueElm.querySelector(':scope > .pin');

      // attach event: show tooltip
      valueElm.addEventListener('mouseenter', () => {
        const valueData = this.#values.find(valueData => valueData.elm === valueElm);
        const event = new CustomEvent(EVENT_enterPropertyValueItemView, {detail: {
          label: `<span style="color: ${App.getHslColor(this.#subject.hue)}">${valueElm.querySelector(':scope > p > .label').textContent}</span>`,
          values: [
            {
              key: 'Count',
              value: valueData.count.toLocaleString()
            }
          ],
          elm: valueElm
        }});
        DefaultEventEmitter.dispatchEvent(event);
      });
      valueElm.addEventListener('mouseleave', () => {
        const event = new CustomEvent(EVENT_leavePropertyValueItemView);
        DefaultEventEmitter.dispatchEvent(event);
      });

      // attach event: select/deselect a value
      valueElm.addEventListener('click', () => {
        const valueData = this.#values.find(valueData => valueData.categoryId === valueElm.dataset.categoryId);
        if (valueElm.classList.contains('-selected')) {
          valueElm.classList.remove('-selected');
          ConditionBuilder.removePropertyValue(this.#property.propertyId, valueData.categoryId);
        } else {
          valueElm.classList.add('-selected');
          ConditionBuilder.addPropertyValue({
            subject: this.#subject,
            property: this.#property,
            value: {
              categoryId: valueData.categoryId,
              label: valueData.label,
              count: valueData.count,
              ancestors: []
            }
          });
        }
      });
    });

    // event listener
    DefaultEventEmitter.addEventListener(EVENT_mutatePropertyValueCondition, e => {
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
    DefaultEventEmitter.addEventListener(EVENT_changeViewModes, e => this.#update(e.detail));
    DefaultEventEmitter.addEventListener(EVENT_setUserValues, e => this.#plotUserIdValues(e.detail));

    this.#update(App.viewModes);
  }

  #update(viewModes) {
    const isArea = viewModes.area;
    const isLog10 = viewModes.log10;
    const sum = this.#values.reduce((acc, value) => acc + (isLog10 ? value.countLog10 : value.count), 0);
    let max = Math.max(...this.#values.map(value => value.count));
    max = isLog10 ? Math.log10(max) : max;
    const fixedWidth = isArea ? 0 : 100 / this.#values.length;
    let width;
    let left = 0;
    this.#values.forEach(value => {
      width = isArea ? (isLog10 ? Math.log10(value.count) : value.count) / sum * 100 : fixedWidth;
      value.elm.style.width = width + '%';
      value.elm.style.left = left + '%';
      value.elm.querySelector(':scope > .heatmap').style.backgroundColor = `rgba(51, 50, 48, ${1 - (isLog10 ? value.countLog10 : value.count) / max})`;
      left += width;
    });
  }

  #plotUserIdValues(detail) {
    if (this.#property.propertyId === detail.propertyId) {
      this.#ROOT.classList.add('-pinsticking');

      this.#values.forEach(value => {
        const userValue = detail.values.find(userValue => userValue.categoryId === value.categoryId);
        if (userValue) {
          value.elm.classList.add('-pinsticking');
          // pin
          const ratio = userValue.count / value.count;
          const size = MIN_PIN_SIZE + RANGE_PIN_SIZE * ratio;
          value.pin.style.width = size + 'px';
          value.pin.style.height = size + 'px';
          value.pin.style.top = -size + 'px';
          value.pin.style.left = (-size / 2) + 'px';
          
          // // dispatch event
          // const event = new CustomEvent(EVENT_stickUserValue, {detail: {
          //   view: value.elm,
          //   userValue,
          //   value
          // }});
          // DefaultEventEmitter.dispatchEvent(event);
        } else {
          value.elm.classList.remove('-pinsticking');
        }
      });
    }
  }

}
