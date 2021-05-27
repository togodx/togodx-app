import TrackView from './TrackView.js';

export default class ConceptView {

  constructor(subject, elm) {
    elm.classList.add('concept-view');
    elm.innerHTML = `
    <h3 class="title" style="background-color: ${subject.colorCSSValue};">
      <span>${subject.subject}</span>
    </h3>
    <div class="properties"></div>`;

    // make tracks
    const properties = subject.properties;
    const propertiesContainer = elm.querySelector(':scope > .properties');
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      new TrackView(subject, property, propertiesContainer, i / properties.length);
    }
  }

}
