export default class StackingConditionView {

  #elm;
  
  /**
   * 
   * @param {HTMLElement} container 
   * @param {String} type: 'property' or 'value'
   * @param {Object} condition 
   */
  constructor(container, type, condition) {
    // make view
    const labelClassName = 'label' + (type === 'property' ? ' _subject-color' : '');
    this.#elm = document.createElement('div');
    this.#elm.classList.add('stacking-condition-view');
    if (type === 'value') this.#elm.classList.add('_subject-background-color');
    this.#elm.dataset.subjectId = condition.subject.subjectId;
    this.#elm.dataset.propertyId = condition.property.propertyId;
    this.#elm.dataset.categoryId = condition.value?.categoryId;
    const ancestors = (() => {
      switch(type) {
        case 'property':
          return [condition.subject.subject];
        case 'value':
          return [condition.subject.subject, condition.property.label, ...condition.value.ancestors]
      }
    })();
    this.#elm.innerHTML = `
    <div class="close-button-view"></div>
    <ul class="path">
      ${ancestors.map(ancestor => `<li>${ancestor}</li>`).join('')}
    </ul>
    <div class="${labelClassName}">${condition.property.label}</div>`;
    container.insertAdjacentElement('beforeend', this.#elm);
  }

  // accessor

  get elm() {
    return this.#elm;
  }

}