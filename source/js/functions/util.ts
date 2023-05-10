import Color from 'colorjs.io';
import DefaultEventEmitter from '../classes/DefaultEventEmitter';

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
