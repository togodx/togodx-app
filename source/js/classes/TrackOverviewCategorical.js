import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";
import ConditionBuilder from "./ConditionBuilder";
import Records from "./Records";
import * as event from '../events';
import * as util from '../functions/util';

const MIN_PIN_SIZE = 12;
const MAX_PIN_SIZE = 24;
const RANGE_PIN_SIZE = MAX_PIN_SIZE - MIN_PIN_SIZE;

export default class TrackOverviewCategorical {

  #attribute;
  #filters;
  #userFilters;
  #ROOT;

  constructor(elm, attribute, filters) {

    this.#ROOT = elm;
    this.#attribute = attribute;
    this.#filters = filters.map(filter => Object.assign({}, filter));
    const category = Records.getCatexxxgoryWithAttributeId(this.#attribute.id);

    // make overview
    // TODO: ヒストグラムは別処理
    const sum = filters.reduce((acc, filter) => acc + filter.count, 0);
    const width = 100 / filters.length;
    const selectedFilters = ConditionBuilder.getSelectedNodes(attribute.id).filters;
    elm.innerHTML = this.#filters.map((filter, index) => {
      filter.countLog10 = filter.count === 0 ? 0 : Math.log10(filter.count);
      filter.width = filter.count / sum * 100;
      filter.baseColor = util.colorTintByHue(category.color, 360 * index / filters.length);
      const selectedClass = selectedFilters.indexOf(filter.node) !== -1 ? ' -selected' : '';
      return `
        <li class="track-filter-view _catexxxgory-background-color${selectedClass}" style="width: ${width}%;" data-node="${filter.node}">
          <div class="labels">
            <p>
              <span class="label">${filter.label}</span>
              <span class="count">${filter.count.toLocaleString()}</span>
            </p>
          </div>
          <div class="pin">
            <span class="material-icons">location_on</span>
          </div>
        </li>`;
    }).join('');

    elm.querySelectorAll(':scope > .track-filter-view').forEach((elm, index) => {

      // reference
      const filter = this.#filters[index];
      filter.elm = elm;
      filter.pin = elm.querySelector(':scope > .pin');
      filter.icon = filter.pin.querySelector(':scope > .material-icons');

      // attach event: show tooltip
      const label = `<span class="_catexxxgory-color" data-catexxxgory-id="${category.id}">${filter.label}</span>`;
      elm.addEventListener('mouseenter', () => {
        const values = [];
        const userFilter = this.#userFilters?.find(userFilter => userFilter.node === filter.node);
        if (userFilter?.mapped) {
          // does not have user filter
          values.push({
            key: 'Count',
            value: `${filter.userFilterCount.toLocaleString()} / ${filter.count.toLocaleString()}`
          });
          if (userFilter?.pvalue) {
            values.push({
              key: 'P-value',
              filter: userFilter.pvalue === 1 ? 1 : userFilter.pvalue.toExponential(3)
            });
          }
        } else {
          // has user filter
          values.push({
            key: 'Count',
            value: filter.count.toLocaleString()
          });
        }
        const customEvent = new CustomEvent(event.enterAttributeFilterItemView, {detail: {label, values, elm}});
        DefaultEventEmitter.dispatchEvent(customEvent);
      });
      elm.addEventListener('mouseleave', () => {
        const customEvent = new CustomEvent(event.leaveAttributeFilterItemView);
        DefaultEventEmitter.dispatchEvent(customEvent);
      });

      // attach event: select/deselect a filter
      elm.addEventListener('click', () => {
        if (elm.classList.contains('-selected')) {
          elm.classList.remove('-selected');
          ConditionBuilder.removeAttributeFilter(this.#attribute.id, filter.node);
        } else {
          elm.classList.add('-selected');
          ConditionBuilder.addAttributeFilter(
            this.#attribute.id,
            filter.node
          );
        }
      });
    });

    // event listener
    DefaultEventEmitter.addEventListener(event.mutateAttributeFilterCondition, ({detail: {action, attributeId, node}}) => {
      if (this.#attribute.id === attributeId) {
        this.#filters.forEach(filter => {
          if (filter.node === node) {
            switch (action) {
              case 'add':
                filter.elm.classList.add('-selected');
                break;
              case 'remove':
                filter.elm.classList.remove('-selected');
                break;
            }
          }
        });
      }
    });
    DefaultEventEmitter.addEventListener(event.changeViewModes, e => this.#update(e.detail));
    DefaultEventEmitter.addEventListener(event.setUserFilters, e => this.#plotUserIdFilters(e.detail));
    DefaultEventEmitter.addEventListener(event.clearUserFilters, e => this.#clearUserIdFilters(e.detail));

    this.#update(App.viewModes);
  }

  #update(viewModes) {
    
    const isLog10 = viewModes.log10;
    const sum = this.#filters.reduce((acc, filter) => acc + (isLog10 ? filter.countLog10 : filter.count), 0);
    let max = Math.max(...this.#filters.map(filter => filter.count));
    max = isLog10 ? Math.log10(max) : max;
    let left = 0;
    this.#filters.forEach(filter => {
      const width = (isLog10 ? (filter.count === 0 ? 0 : Math.log10(filter.count)) : filter.count) / sum * 100;
      filter.elm.style.backgroundColor = `rgb(${filter.baseColor.mix(App.colorSilver, 1 - (isLog10 ? filter.countLog10 : filter.count) / max).coords.map(cood => cood * 256).join(',')})`;
      filter.elm.style.width = width + '%';
      filter.elm.style.left = left + '%';
      left += width;
    });
  }

  #plotUserIdFilters(detail) {
    if (this.#attribute.id === detail.attributeId) {

      this.#ROOT.classList.add('-pinsticking');
      this.#userFilters = detail.filters;

      // mapping
      this.#filters.forEach(filter => {
        const userFilter = detail.filters.find(userFilter => userFilter.node === filter.node);
        if (userFilter?.mapped) {
          filter.elm.classList.add('-pinsticking');
          // pin
          let ratio, pvalueGreaterThan = 1;
          ratio = userFilter.mapped / filter.count;
          ratio = ratio > 1 ? 1 : ratio;
          if (userFilter.pvalue) {
            switch (true) {
              case userFilter.pvalue < 0.001:
                pvalueGreaterThan = '<0.001';
                break;
              case userFilter.pvalue < 0.005:
                pvalueGreaterThan = '<0.005';
                break;
              case userFilter.pvalue < 0.01:
                pvalueGreaterThan = '<0.01';
                break;
              case userFilter.pvalue < 0.05:
                pvalueGreaterThan = '<0.05';
                break;
              case userFilter.pvalue < 0.1:
                pvalueGreaterThan = '<0.1';
                break;
              case userFilter.pvalue < 1:
                pvalueGreaterThan = '<1';
                break;
            }
          } else {
            pvalueGreaterThan = 1;
          }
          const size = MIN_PIN_SIZE + RANGE_PIN_SIZE * ratio;
          filter.pin.style.width = size + 'px';
          filter.pin.style.height = size + 'px';
          filter.icon.style.fontSize = size + 'px';
          filter.userFilterCount = userFilter.mapped;
          filter.elm.dataset.pvalueGreaterThan = pvalueGreaterThan;
        } else {
          filter.elm.classList.remove('-pinsticking');
        }
      });
    }
  }

  #clearUserIdFilters() {
    this.#filters.forEach(filter => filter.elm.classList.remove('-pinsticking'));
    this.#userFilters = undefined;
  }

}
