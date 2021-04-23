
class Records {

  #subjects;
  #properties;

  constructor() {
  }

  // public methods

  setSubjects(subjects) {
    // define subjects
    for (let i = 0; i < subjects.length; i++) {
      let hue = 360 - (360 * i / subjects.length) + 180;
      hue -= hue > 360 ? 360 : 0;
      subjects[i].hue = hue;
    }
    this.#subjects = Object.freeze(subjects);
    // set properties
    this.#properties = [];
    subjects.forEach(subject => {
      subject.properties.forEach(property => {
        this.#properties.push(Object.assign({subjectId: subject.subjectId}, property));
      });
    });
    console.log(this.#subjects);
    console.log(this.#properties);
  }

  setValues(propertyId, values) {
    const property = this.#properties.find(property => property.propertyId === propertyId);
    property.values = values;
  }

  getProperty(propertyId) {
    console.log(propertyId)
    const property = this.#properties.find(property => property.propertyId === propertyId);
    console.log(property)
    return property;
  }

  getValue(propertyId, categoryId) {
    // const property = this.#properties.find(property => property.propertyId === propertyId);
    const property = this.getProperty(propertyId);
    const value = property.values.find(value => value.categoryId === categoryId);
    return value;
  }

  // public accessors

  get subjects() {
    return this.#subjects;
  }

}

export default new Records();
