export default class GlobalToolBar {
  constructor(elm) {
    const buttons = [...elm.querySelectorAll(':scope > ul > li > button')];
    const filter = buttons.find(button => button.dataset.button === 'filter');
    const annotation = buttons.find(
      button => button.dataset.button === 'annotation'
    );

    // attach event
    filter.addEventListener(
      'click',
      () => (document.body.dataset.condition = 'filter')
    );
    annotation.addEventListener(
      'click',
      () => (document.body.dataset.condition = 'annotation')
    );
  }
}
