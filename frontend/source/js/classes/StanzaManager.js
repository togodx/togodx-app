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
    Promise.all(Object.keys(data.templates).map(key => fetch(data.templates[key])))
    .then(responces => Promise.all(responces.map(responce => responce.text())))
    .then(templates => {
      // set stanza templates
      this.#templates = Object.fromEntries(Object.keys(data.templates).map((stanza, index) => [stanza, templates[index]]));
      this.#isReady = true;
      console.log(this.#templates)
    });
  }

  draw(subjectId, id, key) {
    return `<div class="stanza">${this.#templates[subjectId].replace(/{{id}}/g, id).replace(/{{type}}/g, key)}</div>`;
  }

  get isReady() {
    return this.#isReady;
  }

}

export default new StanzaManager();
