import Color from 'colorjs.io';
import DefaultEventEmitter from '../classes/DefaultEventEmitter';

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
