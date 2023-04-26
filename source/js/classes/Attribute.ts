export default class Attribute {
  #id: string;
  #obj;
  #filters;

  constructor(id: string, obj) {
    this.#id = id;
    this.#obj = obj;
    this.#filters = [];
  }

  // public Methods

  fetchFiltersWithParentNode(parentNode) {
    console.log(parentNode);
    return new Promise((resolve, reject) => {
      const filters = this.#filters.filter(
        filter => filter.parentNode === parentNode
      );
      console.log(filters);
      if (filters.length > 0) {
        resolve(filters);
      } else {
        const body = {};
        if (parentNode) body.node = parentNode;
        if (this.order) body.order = this.order;
        fetch(this.api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
          .then(responce => responce.json())
          .then(filters => {
            // set parent node
            if (parentNode)
              filters.forEach(filter => (filter.parentNode = parentNode));
            // set filters
            this.#filters.push(...filters);
            resolve(filters);
          })
          .catch(error => {
            console.error(this, error);
            reject(error);
          });
      }
    });
  }

  getFilter(node: string) {
    return this.#filters.find(filter => filter.node === node);
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

  get filters() {
    return this.#filters;
  }
}
