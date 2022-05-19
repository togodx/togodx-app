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

  fetchValuesWithParentNode(parentNode) {
    return new Promise((resolve, reject) => {
      const values = this.#values.filter(value => value.parentNode === parentNode);
      if (values.length > 0) {
        resolve(values);
      } else {
        const body = {};
        if (parentNode) body.node = parentNode;
        if (this.order) body.order = this.order;
        fetch(
          this.api,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          }
        )
        .then(responce => responce.json())
        .then(values => {

          // set parent node
          if (parentNode) values.forEach(value => value.parentNode = parentNode);
          // set values
          this.#values.push(...values);
          resolve(values);
        })
        .catch(error => {
          console.error(this, error);
          reject(error);
        });
      }
    });
  }

  getValue(node) {
    return this.#values.find(value => value.node === node);
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

  get order() {
    return this.#obj.order;
  }

  get values() {
    return this.#values;
  }

}