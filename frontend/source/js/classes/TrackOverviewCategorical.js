import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";
import ConditionBuilder from "./ConditionBuilder";
import * as event from '../events';
import * as util from '../functions/util';

const MIN_PIN_SIZE = 12;
const MAX_PIN_SIZE = 24;
const RANGE_PIN_SIZE = MAX_PIN_SIZE - MIN_PIN_SIZE;

export default class TrackOverviewCategorical {

  #subject;
  #property;
  #values;
  #userValues;
  #ROOT;

  constructor(elm, subject, property, values) {

    this.#ROOT = elm;
    this.#subject = subject;
    this.#property = property;
    this.#values = values.map(value => Object.assign({}, value));
    const selectedCategoryIds = ConditionBuilder.getSelectedCategoryIds(this.#property.propertyId);

    // make overview
    // TODO: ヒストグラムは別処理
    const sum = values.reduce((acc, value) => acc + value.count, 0);
    const width = 100 / values.length;
    elm.innerHTML = this.#values.map((value, index) => {
      value.countLog10 = value.count === 0 ? 0 : Math.log10(value.count);
      value.width = value.count / sum * 100;
      value.baseColor = util.colorTintByHue(subject.color, 360 * index / values.length);
      const selectedClass = selectedCategoryIds.indexOf(value.categoryId) !== -1 ? ' -selected' : '';
      return `
        <li class="track-value-view _subject-background-color${selectedClass}" style="width: ${width}%;" data-category-id="${value.categoryId}">
          <div class="labels">
            <p>
              <span class="label">${value.label}</span>
              <span class="count">${value.count.toLocaleString()}</span>
            </p>
          </div>
          <div class="pin">
            <span class="material-icons">location_on</span>
          </div>
        </li>`;
    }).join('');

    elm.querySelectorAll(':scope > .track-value-view').forEach((elm, index) => {

      // reference
      const value = this.#values[index];
      value.elm = elm;
      value.pin = elm.querySelector(':scope > .pin');
      value.icon = value.pin.querySelector(':scope > .material-icons');

      // attach event: show tooltip
      const label = `<span class="_subject-color" data-subject-id="${this.#subject.subjectId}">${value.label}</span>`;
      elm.addEventListener('mouseenter', () => {
        const values = [];
        const userValue = this.#userValues?.find(userValue => userValue.categoryId === value.categoryId);
        if (userValue?.hit_count) {
          // does not have user value
          values.push({
            key: 'Count',
            value: `${value.userValueCount.toLocaleString()} / ${value.count.toLocaleString()}`
          });
          if (userValue?.pValue) {
            values.push({
              key: 'P-value',
              value: userValue.pValue === 1 ? 1 : userValue.pValue.toExponential(3)
            });
          }
        } else {
          // has user value
          values.push({
            key: 'Count',
            value: value.count.toLocaleString()
          });
        }
        const customEvent = new CustomEvent(event.enterPropertyValueItemView, {detail: {label, values, elm}});
        DefaultEventEmitter.dispatchEvent(customEvent);
      });
      elm.addEventListener('mouseleave', () => {
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
          ConditionBuilder.addPropertyValue(
            this.#property.propertyId,
            value.categoryId
          );
        }
      });
    });

    // event listener
    DefaultEventEmitter.addEventListener(event.mutatePropertyValueCondition, ({detail: {action, propertyId, categoryId}}) => {
      if (this.#property.propertyId === propertyId) {
        this.#values.forEach(value => {
          if (value.categoryId === categoryId) {
            switch (action) {
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
    
    // const isArea = viewModes.area;
    const isLog10 = viewModes.log10;
    const sum = this.#values.reduce((acc, value) => acc + (isLog10 ? value.countLog10 : value.count), 0);
    let max = Math.max(...this.#values.map(value => value.count));
    max = isLog10 ? Math.log10(max) : max;
    // const fixedWidth = isArea ? 0 : 100 / this.#values.length;
    let left = 0;
    this.#values.forEach(value => {
      // const width = isArea ? (isLog10 ? Math.log10(value.count) : value.count) / sum * 100 : fixedWidth;
      const width = (isLog10 ? (value.count === 0 ? 0 : Math.log10(value.count)) : value.count) / sum * 100;
      value.elm.style.backgroundColor = `rgb(${value.baseColor.mix(App.colorSilver, 1 - (isLog10 ? value.countLog10 : value.count) / max).coords.map(cood => cood * 256).join(',')})`;
      value.elm.style.width = width + '%';
      value.elm.style.left = left + '%';
      left += width;
    });
  }

  #plotUserIdValues(detail) {
    if (this.#property.propertyId === detail.propertyId) {

      this.#ROOT.classList.add('-pinsticking');
      this.#userValues = detail.values;

      // calculate min value
      // let maxPValue;
      // if (detail.values[0]?.pValue) {
      //   const minPValue = Math.min(...detail.values.map(value => value.pValue));
      //   maxPValue = 1 - Math.log10(minPValue);
      // }

      // mapping
      this.#values.forEach(value => {
        const userValue = detail.values.find(userValue => userValue.categoryId === value.categoryId);
        if (userValue?.hit_count) {
          value.elm.classList.add('-pinsticking');
          // pin
          let ratio, pValueGreaterThan = 1;
          ratio = userValue.hit_count / value.count;
          ratio = ratio > 1 ? 1 : ratio;
          if (userValue.pValue) {
            // ratio = (1 - Math.log10(userValue.pValue)) / maxPValue;
            switch (true) {
              case userValue.pValue < 0.001:
                pValueGreaterThan = '<0.001';
                break;
              case userValue.pValue < 0.005:
                pValueGreaterThan = '<0.005';
                break;
              case userValue.pValue < 0.01:
                pValueGreaterThan = '<0.01';
                break;
              case userValue.pValue < 0.05:
                pValueGreaterThan = '<0.05';
                break;
              case userValue.pValue < 0.1:
                pValueGreaterThan = '<0.1';
                break;
              case userValue.pValue < 1:
                pValueGreaterThan = '<1';
                break;
            }
          } else {
            // ratio = userValue.count / value.count;
            // ratio = ratio > 1 ? 1 : ratio;
            pValueGreaterThan = 1;
          }
          const size = MIN_PIN_SIZE + RANGE_PIN_SIZE * ratio;
          value.pin.style.width = size + 'px';
          value.pin.style.height = size + 'px';
          value.icon.style.fontSize = size + 'px';
          value.userValueCount = userValue.hit_count;
          value.elm.dataset.pValueGreaterThan = pValueGreaterThan;
        } else {
          value.elm.classList.remove('-pinsticking');
        }
      });
    }
  }

  #clearUserIdValues() {
    this.#values.forEach(value => value.elm.classList.remove('-pinsticking'));
    this.#userValues = undefined;
  }

}
