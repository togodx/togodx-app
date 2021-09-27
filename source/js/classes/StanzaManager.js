class StanzaManager {
  #templates;
  #isReady;

  constructor() {
    this.#isReady = false;
  }

  init(data) {
    // embed modules
    const head = document.querySelector('head');
    data.stanzas.forEach(stanza => {
      const script = document.createElement('script');
      script.setAttribute('type', 'module');
      script.setAttribute('src', stanza);
      script.setAttribute('async', 1);
      head.appendChild(script);
    });

    // fetch templates
    Promise.all(
      Object.keys(data.templates).map(key => fetch(data.templates[key]))
    )
      .then(responces =>
        Promise.all(responces.map(responce => responce.text()))
      )
      .then(templates => {
        // set stanza templates
        this.#templates = Object.fromEntries(
          Object.keys(data.templates).map((stanza, index) => [
            stanza,
            templates[index],
          ])
        );
        this.#isReady = true;
      });
  }

  /**˝
   * @param {String} key  key of Database used to get template
   * @param {String} id  ID of dataset
   * @returns {String} HTML
   */
  draw(key, id) {
    return `<div class="stanza">${this.#templates[key].replace(
      /{{id}}/g,
      id
    )}</div>`;
  }

  get isReady() {
    return this.#isReady;
  }
}

export default new StanzaManager();
