import axios from 'axios';
import Color from 'colorjs.io';
import DefaultEventEmitter from '../classes/DefaultEventEmitter';
import {state} from '../classes/CategoryBrowserView/CategoryBrowserState';

export function colorTintByHue(baseColor: Color, hue: number): Color {
  return baseColor
    .mix(new Color('hsv', [hue, 70, 50]), 0.15)
    .set({lightness: lightness => lightness * 1.1})
    .to('srgb');
}

export function createPopupEvent(
  togoKeyView: HTMLElement,
  newEvent: string
): void {
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

<<<<<<< HEAD:source/js/functions/util.js
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
=======
type ArrowedFormat = 'tsv' | 'json';
export function download(
  text: string,
  format: ArrowedFormat,
  filename: string,
  isTimestamp: boolean
): void {
  const FORMAT = {
    tsv: {mime: 'text/tsv', extension: 'tsv'},
    json: {mime: 'application/json', extension: 'json'},
  };
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const blob = new Blob([bom, text], {type: FORMAT[format].mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}${
    isTimestamp ? `_${new Date().toISOString()}` : ''
  }.${FORMAT[format].extension}`;
  a.click();
  a.remove();
}
>>>>>>> import-condition3:source/js/functions/util.ts
