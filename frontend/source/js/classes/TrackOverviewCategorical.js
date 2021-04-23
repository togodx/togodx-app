import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";
import ConditionBuilder from "./ConditionBuilder";

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
        <li class="value" style="width: ${width}%;" data-category-id="${value.categoryId}">
          <div class="color" style="background-color: ${value.color};"></div>
          <div class="heatmap"></div>
          <p>
            <span class="label">${value.label}</span>
            <span class="count">${value.count.toLocaleString()}</span>
          </p>
          <div class="pin"></div>
        </li>`;
    }).join('');
    elm.querySelectorAll(':scope > .value').forEach((node, index) =>  this.#values[index].elm = node);
    this.#update(App.viewModes);

    // attach event
    elm.querySelectorAll(':scope > .value').forEach(valueElm => {

      // show tooltip
      valueElm.addEventListener('mouseenter', () => {
        const valueData = this.#values.find(valueData => valueData.elm === valueElm);
        const event = new CustomEvent('enterPropertyValueItemView', {detail: {
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
        const event = new CustomEvent('leavePropertyValueItemView');
        DefaultEventEmitter.dispatchEvent(event);
      });

      // select/deselect a value
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
    DefaultEventEmitter.addEventListener('mutatePropertyValueCondition', e => {
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
    DefaultEventEmitter.addEventListener('changeViewModes', e => this.#update(e.detail));
    DefaultEventEmitter.addEventListener('userValues', e => this.#plotUserIdValues(e.detail));
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
          // dispatch event
          const event = new CustomEvent('stickUserValue', {detail: {
            view: value.elm,
            userValue,
            value
          }});
          DefaultEventEmitter.dispatchEvent(event);
        } else {
          value.elm.classList.remove('-pinsticking');
        }
      });
    }
  }

}
