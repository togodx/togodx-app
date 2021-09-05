import Color from "./Color";

class Records {
  #subjects;
  #properties;
  #fetchedCategoryIds;

  constructor() {}

  // public methods

  setSubjects(subjects) {
    console.log(subjects)

    // define subjects
    for (let i = 0; i < subjects.length; i++) {
      let hue = 360 - (360 * i / subjects.length) + 130;
      hue -= hue > 360 ? 360 : 0;
      const srgb = new Color('hsv', [hue, 45, 85]).to('srgb');
      const srgbStrong = new Color('hsv', [hue, 65, 65]).to('srgb');
      subjects[i].hue = hue;
      subjects[i].color = srgb;
      subjects[i].colorCSSValue = `rgb(${srgb.coords.map(channel => channel * 256).join(',')})`;
      subjects[i].colorCSSStrongValue = `rgb(${srgbStrong.coords.map(channel => channel * 256).join(',')})`;
    }
    this.#subjects = Object.freeze(subjects);

    // set properties
    this.#properties = [];
    this.#fetchedCategoryIds = {};
    subjects.forEach(subject => {
      subject.properties.forEach(property => {
        this.#properties.push(Object.assign({
          subjectId: subject.subjectId,
          values: []
        }, property));
        this.#fetchedCategoryIds[property.propertyId] = [];
      });
    });
    console.log(this.#subjects);
    console.log(this.#properties);
    console.log(this.#fetchedCategoryIds);

    // make stylesheet
    const styleElm = document.createElement('style');
    document.head.appendChild(styleElm);
    const styleSheet = styleElm.sheet;
    styleSheet.insertRule(`:root {
      ${subjects.map(subject => `
        --color-subject-${subject.subjectId}: ${subject.colorCSSValue};
        --color-subject-${subject.subjectId}-strong: ${subject.colorCSSStrongValue};
        `).join('')}
    }`);
    for (const subject of subjects) {
      styleSheet.insertRule(`
      ._subject-color[data-subject-id="${subject.subjectId}"], [data-subject-id="${subject.subjectId}"] ._subject-color {
        color: var(--color-subject-${subject.subjectId}-strong);
      }`);
      styleSheet.insertRule(`
      ._subject-background-color[data-subject-id="${subject.subjectId}"], [data-subject-id="${subject.subjectId}"] ._subject-background-color {
        background-color: var(--color-subject-${subject.subjectId});
      }`);
      styleSheet.insertRule(`
      ._subject-background-color-strong[data-subject-id="${subject.subjectId}"], [data-subject-id="${subject.subjectId}"] ._subject-background-color-strong {
        background-color: var(--color-subject-${subject.subjectId}-strong);
      }`);
      styleSheet.insertRule(`
      ._subject-border-color[data-subject-id="${subject.subjectId}"], [data-subject-id="${subject.subjectId}"] ._subject-border-color {
        border-color: var(--color-subject-${subject.subjectId});
      }`);
    }
  }

  fetchPropertyValues(propertyId, categoryId) {
    const property = this.getProperty(propertyId);
    return new Promise((resolve, reject) => {
      if (categoryId && this.#fetchedCategoryIds[propertyId].indexOf(categoryId) !== -1) {
        resolve(property.values.filter(value => value.parentCategoryId === categoryId));
      } else {
        fetch(`${property.data}${categoryId ? `?categoryIds=${categoryId}` : ''}`)
        .then(responce => responce.json())
        .then(values => {
          // set parent category id
          if (categoryId) values.forEach(value => value.parentCategoryId = categoryId);
          // set values
          property.values.push(...values);
          resolve(values);
        })
        .catch(error => reject(error));
      }
    });
  }

  getSubject(subjectId) {
    return this.#subjects.find((subject) => subject.subjectId === subjectId);
  }

  getSubjectWithPropertyId(propertyId) {
    const subject = this.#subjects.find(subject => subject.properties.some(property => property.propertyId === propertyId));
    return subject;
  }

  getProperty(propertyId) {
    const property = this.#properties.find(property => property.propertyId === propertyId);
    return property;
  }

  getValue(propertyId, categoryId) {
    const property = this.getProperty(propertyId);
    const value = property.values.find(value => value.categoryId === categoryId);
    return value;
  }

  getValuesWithParentCategoryId(propertyId, parentCategoryId) {
    const property = this.getProperty(propertyId);
    return property.values.filter(value => value.parentCategoryId === parentCategoryId);
  }

  getAncestors(propertyId, categoryId) {
    const property = this.getProperty(propertyId);
    const ancestors = [];
    let parent;
    do { // find ancestors
      parent = property.values.find(value => value.categoryId === categoryId);
      if (parent) ancestors.unshift(parent);
      categoryId = parent?.parentCategoryId;
    } while (parent);
    ancestors.pop();
    return ancestors;
  }

  getLabelFromTogoKey(togoKey) {
    return this.#subjects.find(subject => subject.togoKey === togoKey).keyLabel;
  }

  // public accessors

  get subjects() {
    return this.#subjects;
  }

  get properties() {
    return this.#properties;
  }
}

export default new Records();
