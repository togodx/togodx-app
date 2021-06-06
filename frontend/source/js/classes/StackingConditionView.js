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
    const labelClassName = `label` + type === 'property' ? ' _subject-color' : '';
    this.#elm = document.createElement('div');
    this.#elm.classList.add('stacking-condition-view');
    this.#elm.dataset.subjectId = condition.subject.subjectId;
    this.#elm.dataset.propertyId = condition.property.propertyId;
    this.#elm.innerHTML = `
    <div class="close-button-view"></div>
    <ul class="path">
      <li>${condition.subject.subject}</li>
    </ul>
    <div class="${labelClassName}" style="color: ${condition.subject.colorCSSValue};">${condition.property.label}</div>`;
    container.insertAdjacentElement('beforeend', this.#elm);
  }

  // accessor

  get elm() {
    return this.#elm;
  }

}