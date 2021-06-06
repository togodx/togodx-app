export default class StackingConditionView {

  #elm;
  
  /**
   * 
   * @param {HTMLElement} container 
   * @param {String} type: 'property' or 'value'
   * @param {Object} condition 
   */
  constructor(container, type, condition) {
    console.log(condition)
    // make view
    this.#elm = document.createElement('div');
    this.#elm.classList.add('stacking-condition-view');
    if (type === 'value') this.#elm.classList.add('_subject-background-color');
    this.#elm.dataset.subjectId = condition.subject.subjectId;
    this.#elm.dataset.propertyId = condition.property.propertyId;
    if (condition.value) this.#elm.dataset.categoryId = condition.value.categoryId;
    if (condition.subCategory) this.#elm.dataset.parentCategoryId = condition.subCategory.parentCategoryId;
    const labelClassName = 'label' + (type === 'property' ? ' _subject-color' : '');
    let label, ancestors = [condition.subject.subject];
    switch(type) {
      case 'property':
        if (condition.subCategory) {
          label = condition.subCategory.label;
          ancestors.push(condition.property.label, ...condition.subCategory.ancestors);
        } else {
          label = condition.property.label;
        }
        break;
      case 'value':
        label = condition.value.label;
        ancestors.push(condition.property.label, ...condition.value.ancestors);
        break;
    }
    this.#elm.innerHTML = `
    <div class="close-button-view"></div>
    <ul class="path">
      ${ancestors.map(ancestor => `<li>${ancestor}</li>`).join('')}
    </ul>
    <div class="${labelClassName}">${label}</div>`;
    container.insertAdjacentElement('beforeend', this.#elm);
  }

  // accessor

  get elm() {
    return this.#elm;
  }

}