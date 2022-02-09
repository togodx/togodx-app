export default class Attribute {

  #id;
  #obj;
  #values;

  constructor(id, obj) {
    this.#id = id;
    this.#obj = obj;
    this.#values = [];
  }


  // public Methods

  fetchValuesWithParentCategoryId(parentCategoryId) {
    return new Promise((resolve, reject) => {
      const values = this.#values.filter(value => value.parentCategoryId === parentCategoryId);
      if (values.length > 0) {
        resolve(values);
      } else {
        fetch(`${this.api}${parentCategoryId ? `?node=${parentCategoryId}` : ''}`)
        .then(responce => responce.json())
        .then(values => {

          const __zzz__values = values.map(value => {
            return {
              categoryId: value.node,
              count: value.count,
              hasChild: !value.leaf,
              label: value.label
            };
          });
          
          // set parent category id
          // if (parentCategoryId) values.forEach(value => value.parentCategoryId = parentCategoryId);
          if (parentCategoryId) __zzz__values.forEach(value => value.parentCategoryId = parentCategoryId);
          // set values
          // this.#values.push(...values);
          this.#values.push(...__zzz__values);
          // resolve(values);
          resolve(__zzz__values);
        })
        .catch(error => {
          console.error(this, error);
          reject(error);
        });
      }
    });
  }

  getValue(categoryId) {
    return this.#values.find(value => value.categoryId === categoryId);
  }

  // accessors

  get id() {
    return this.#id;
  }

  get label() {
    return this.#obj.label;
  }

  get description() {
    return this.#obj.description;
  }

  get api() {
    return this.#obj.api;
  }

  get dataset() {
    return this.#obj.dataset;
  }

  get datamodel() {
    return this.#obj.datamodel;
  }

  get source() {
    return this.#obj.source;
  }

  get values() {
    return this.#values;
  }

}