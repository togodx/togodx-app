import Color from "./Color";

class Records {

  #subjects;
  #properties;

  constructor() {
  }

  // public methods

  setSubjects(subjects) {
    // define subjects
    for (let i = 0; i < subjects.length; i++) {
      let hue = 360 - (360 * i / subjects.length) + 130;
      hue -= hue > 360 ? 360 : 0;
      const srgb = new Color('hsv', [hue, 60, 75]).to('srgb');
      subjects[i].hue = hue;
      subjects[i].color = srgb;
      subjects[i].colorCSSValue = `rgb(${srgb.coords.map(channel => channel * 256).join(',')})`;
    }
    console.log(subjects);
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

  // Naming needs improvement but there is a hierarcy like below
  // Togo-key   (Uniprot)
	//  → Subject  (Gene)
  //    → Main-Category  (Expressed in tissues)
  //      → Sub-Category  (Thyroid Gland)
  //        → Unique-Entry (ENSG00000139304)

  // Main-Category
  getProperty(propertyId) {
    const property = this.#properties.find(property => property.propertyId === propertyId);
    return property;
  }
  // Sub-Category 
  getValue(propertyId, categoryId) {
    // const property = this.#properties.find(property => property.propertyId === propertyId);
    const property = this.getProperty(propertyId);
    const value = property.values.find(value => value.categoryId === categoryId);
    return value;
  }

  // TODO: set getter for Subject with hue and label info
  getSubject(subjectId) {
    return {
      hue:  234,
      label: "SUBJECT-LABEL: " + subjectId,
    }
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
