import Color from '../classes/Color';
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

export function createPopupEvent(uniqueEntry, reportLink, newEvent) {
  const [x, y] = uniqueEntry.getAttribute('data-order').split(',');
  const customEvent = new CustomEvent(newEvent, {
    detail: {
      keys: {
        dataKey: uniqueEntry.getAttribute('data-key'),
        subjectId: uniqueEntry.getAttribute('data-subject-id'),
        mainCategoryId: uniqueEntry.getAttribute('data-main-category-id'),
        subCategoryId: uniqueEntry.getAttribute('data-sub-category-id'),
        uniqueEntryId: uniqueEntry.getAttribute('data-unique-entry-id'),
      },
      properties: {
        dataX: x,
        dataY: y,
        dataSubOrder: uniqueEntry.getAttribute('data-sub-order'),
        isPrimaryKey: uniqueEntry.classList.contains('primarykey'),
        reportLink: reportLink,
      },
    },
  });
  DefaultEventEmitter.dispatchEvent(customEvent);
}
