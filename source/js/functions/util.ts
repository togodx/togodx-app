import axios, {type AxiosInstance} from 'axios';
import Color from 'colorjs.io';
import DefaultEventEmitter from '../classes/DefaultEventEmitter.ts';
import { ShowEntryDetail } from '../interfaces.ts';

export function colorTintByHue(baseColor: Color, hue: number): Color {
  return baseColor
    .mix(new Color('hsv', [hue, 70, 50]), 0.15)
    .set({lightness: lightness => lightness * 1.1})
    .to('srgb');
}

export function isSameArray(arr1: any[], arr2: any[]): boolean {
  return (
    arr1.length === arr2.length && arr1.every((val, idx) => val === arr2[idx])
  );
}

export function createPopupEvent(
  togoKeyView: HTMLElement,
  newEvent: string
): void {
  const x = togoKeyView.dataset.x as string;
  const y = togoKeyView.dataset.y as string;
  const detail: ShowEntryDetail = { // TODO: keys と properties は使ってないかもしれない
    togoKeyView,
    keys: {
      dataKey: togoKeyView.dataset.dataset as string,
      subjectId: togoKeyView.dataset.categoryId as string,
      mainCategoryId: togoKeyView.dataset.attributeId as string,
      subCategoryId: togoKeyView.dataset.node as string,
      uniqueEntryId: togoKeyView.dataset.entry as string,
    },
    properties: {
      dataX: x,
      dataY: y,
      dataSubOrder: togoKeyView.dataset.y2 as string,
      isPrimaryKey: togoKeyView.classList.contains('primarykey'),
    },
}
  const customEvent = new CustomEvent(newEvent, {
    detail});
  DefaultEventEmitter.dispatchEvent(customEvent);
}

export class cachedAxios {
  axios: AxiosInstance;
  maxCacheSize: number;
  cache: Map<string, object>;
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

  get(url: string) {
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url));
    }
    return this.axios.get(url).then(res => {
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

  post(url: string) {
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
