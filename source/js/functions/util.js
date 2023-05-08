import axios from 'axios';
import Color from 'colorjs.io';
import DefaultEventEmitter from '../classes/DefaultEventEmitter';
import {state} from '../classes/CategoryBrowserView/CategoryBrowserState';

/**
 *
 * @param {Color} baseColor
 * @param {Color} tintColor
 */
export function colorTintByHue(baseColor, hue) {
  return baseColor
    .mix(new Color('hsv', [hue, 70, 50]), 0.15)
    .set({lightness: lightness => lightness * 1.1})
    .to('srgb');
}

export function createPopupEvent(togoKeyView, newEvent) {
  const x = togoKeyView.dataset.x;
  const y = togoKeyView.dataset.y;
  const customEvent = new CustomEvent(newEvent, {
    detail: {
      togoKeyView,
      keys: {
        dataKey: togoKeyView.dataset.dataset,
        subjectId: togoKeyView.dataset.categoryId,
        mainCategoryId: togoKeyView.dataset.attributeId,
        subCategoryId: togoKeyView.dataset.node,
        uniqueEntryId: togoKeyView.dataset.entry,
      },
      properties: {
        dataX: x,
        dataY: y,
        dataSubOrder: togoKeyView.dataset.y2,
        isPrimaryKey: togoKeyView.classList.contains('primarykey'),
      },
    },
  });
  DefaultEventEmitter.dispatchEvent(customEvent);
}

export class cachedAxios {
  /**
   * Create cached axios instance
   * @param {string} baseURL - base URL.
   * @param {number} maxCacheSize - maximum cache entries number. After reaching this treshold, oldest entries will be deleted from cache.
   */
  constructor(maxCacheSize = 100) {
    this.axios = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    this.maxCacheSize = maxCacheSize;
    this.cache = new Map();
  }

  /**
   *
   * @param {string} url - url part bo be fetched. Fetched url will be  baseURL + url
   * @returns {object} {data} - response data
   */
  get(url) {
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url));
    }
    return this.axios.get().then(res => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      if (Object.keys(res.data).length === 0) {
        throw new Error('Empty response from API');
      }

      this.cache.set(url, {data: res.data});
      if (this.cache.size > this.maxCacheSize) {
        const [first] = this.cache.keys();
        this.cache.delete(first);
      }
      return {data: res.data};
    });
  }

  post(url) {
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url));
    }
    return this.axios.post(url).then(res => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      if (Object.keys(res.data).length === 0) {
        throw new Error('Empty response from API');
      }

      this.cache.set(url, {data: res.data});
      if (this.cache.size > this.maxCacheSize) {
        const [first] = this.cache.keys();
        this.cache.delete(first);
      }
      return {data: res.data};
    });
  }
}

const mutationObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === 'attributes') {
      state.condition = mutation.target.dataset.condition;
    }
  });
});

mutationObserver.observe(document.body, {
  attributes: true,
  attributeFilter: ['data-condition'],
});
