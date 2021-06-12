export default class StackingConditionView {

  #delegate;
  #type;
  #values;
  #condition;
  #ROOT;
  
  /**
   * 
   * @param {HTMLElement} container 
   * @param {String} type: 'property' or 'value'
   * @param {Object} condition 
   */
  constructor(delegate, container, type, condition) {
    console.log(condition)

    this.#delegate = delegate;
    this.#type = type;
    this.#condition = condition;
    
    // make view
    this.#ROOT = document.createElement('div');
    this.#ROOT.classList.add('stacking-condition-view');
    if (type === 'value') this.#ROOT.classList.add('_subject-background-color');
    this.#ROOT.dataset.subjectId = condition.subject.subjectId;
    this.#ROOT.dataset.propertyId = condition.property.propertyId;
    if (condition.value) this.#ROOT.dataset.categoryId = condition.value.categoryId;
    if (condition.subCategory) this.#ROOT.dataset.parentCategoryId = condition.subCategory.parentCategoryId;
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
    this.#ROOT.innerHTML = `
    <div class="close-button-view"></div>
    <ul class="path">
      ${ancestors.map(ancestor => `<li>${ancestor}</li>`).join('')}
    </ul>
    <div class="${labelClassName}">${label}</div>`;
    container.insertAdjacentElement('beforeend', this.#ROOT);

    // event
    this.#ROOT.querySelector(':scope > .close-button-view').addEventListener('click', () => {
      console.log('click')
      switch (type) {
        case 'property':
          delegate.removeProperty(this.#condition.property.propertyId, this.#condition.subCategory?.parentCategoryId);
          break;
        case 'value':
          break;
      }
    });
  }


  // public methods

  addValue(value) {}

  removeProperty(propertyId, parentCategoryId) {
    const isMatch = propertyId === this.#condition.property.propertyId
      && parentCategoryId ? parentCategoryId === this.#condition.subCategory?.parentCategoryId : true;
    if (isMatch) this.#ROOT.parentNode.removeChild(this.#ROOT);
    return isMatch;
  }


  // accessor

  get elm() {
    return this.#ROOT;
  }

}