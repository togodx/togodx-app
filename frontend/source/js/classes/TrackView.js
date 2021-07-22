import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records";
import ConditionBuilder from "./ConditionBuilder";
import collapseView from '../functions/collapseView';
import ColumnSelectorView from './ColumnSelectorView';
import HistogramRangeSelectorView from './HistogramRangeSelectorView';
import TrackOverviewCategorical from './TrackOverviewCategorical';
import * as event from '../events';

export default class TrackView {

  #subject;
  #property;
  #sparqlist;
  #ROOT;
  #LOADING_VIEW;
  #SELECT_CONTAINER;
  #OVERVIEW_CONTAINER;
  #CHECKBOX_ALL_PROPERTIES;
  #COLLAPSE_BUTTON;

  constructor(subject, property, container, positionRate) {
    // console.log(subject, property, container)

    const isSelected = ConditionBuilder.isSelectedProperty(property.propertyId);
    const elm = document.createElement('div');
    container.insertAdjacentElement('beforeend', elm);
    this.#ROOT = elm;
    this.#subject = subject;
    this.#property = property;
    this.#sparqlist = property.data;
    elm.classList.add('track-view', '-preparing', 'collapse-view');
    if (isSelected) elm.classList.add('-allselected');
    elm.dataset.subjectId = subject.subjectId;
    elm.dataset.propertyId = property.propertyId;
    elm.dataset.collapse = property.propertyId;

    // make html
    const checked = isSelected ? ' checked' : '';
    elm.innerHTML = `
    <div class="row -upper">
      <div class="left definition">
        <div class="collapsebutton" data-collapse="${property.propertyId}">
          <h2 class="title _subject-color">${property.label}</h2>
          <input type="checkbox" class="mapping"${checked}>
        </div>
      </div>
      <div class="right values">
        <div class="overview _subject-background-color">
          <ul class="inner"></ul>
          <div class="loading-view -shown"></div>
        </div>
      </div>
    </div>
    <div class="row -lower collapsingcontent" data-collapse="${property.propertyId}">
      <div class="left">
        <p class="description">${property.description}</p>
        <!--<label><input type="checkbox">All properties</label>-->
        <a class="external-link-button-view" href="${this.#sparqlist}" target="_blank">API</a>
      </div>
      <div class="right selector"></div>
    </div>`;
    const valuesContainer = elm.querySelector(':scope > .row.-upper > .values');
    this.#OVERVIEW_CONTAINER = valuesContainer.querySelector(':scope > .overview > .inner');
    this.#LOADING_VIEW = valuesContainer.querySelector(':scope > .overview > .loading-view');
    this.#SELECT_CONTAINER = elm.querySelector(':scope > .row.-lower > .selector');
    this.#COLLAPSE_BUTTON = elm.querySelector(':scope > .row.-upper > .left > .collapsebutton');

    // collapse
    collapseView(elm);

    // select/deselect a property
    this.#CHECKBOX_ALL_PROPERTIES = elm.querySelector(':scope > .row.-upper > .left > .collapsebutton > input.mapping');
    this.#CHECKBOX_ALL_PROPERTIES.addEventListener('click', e => {
      e.stopPropagation();
      if (this.#CHECKBOX_ALL_PROPERTIES.checked) { // add
        ConditionBuilder.addProperty(this.#property.propertyId);
        this.#ROOT.classList.add('-allselected');
      } else { // remove
        ConditionBuilder.removeProperty(this.#property.propertyId);
        this.#ROOT.classList.remove('-allselected');
      }
    });
    // event listener
    DefaultEventEmitter.addEventListener(event.mutatePropertyCondition, e => {
      if (e.detail.parentCategoryId !== undefined) return;
      switch (e.detail.action) {
        case 'add':
          if (e.detail.propertyId === this.#property.propertyId) {
            this.#CHECKBOX_ALL_PROPERTIES.checked = true;
            this.#ROOT.classList.add('-allselected');
          }
        break;
        case 'remove':
          if (e.detail.propertyId === this.#property.propertyId) {
            this.#CHECKBOX_ALL_PROPERTIES.checked = false;
            this.#ROOT.classList.remove('-allselected');
          }
          break;
      }
    });
    DefaultEventEmitter.addEventListener(event.allTracksCollapse, (e) => {
      if (e.detail) {
        if (!this.#ROOT.classList.contains('-spread')) {
          this.#COLLAPSE_BUTTON.dispatchEvent(new MouseEvent('click'));
        }
      } else {
        if (this.#ROOT.classList.contains('-spread')) {
          this.#COLLAPSE_BUTTON.dispatchEvent(new MouseEvent('click'));
        }
      }
    });

    // get property data
    Records.fetchPropertyValues(this.#property.propertyId)
      .then(values => this.#makeValues(values))
      .catch(error => {
        console.error(error)
        this.#OVERVIEW_CONTAINER.insertAdjacentHTML('afterend', `<div class="error">${error} - <a href="${this.#property.data}" target="_blank">${this.#property.data}</a></div>`);
        this.#LOADING_VIEW.classList.remove('-shown');
      });
  }

  // private methods

  #makeValues(values) {

    this.#ROOT.classList.remove('-preparing');
    this.#LOADING_VIEW.classList.remove('-shown');

    // make overview
    new TrackOverviewCategorical(this.#OVERVIEW_CONTAINER, this.#subject, this.#property, values);

    // make selector view
    if (this.#property.viewMethod && this.#property.viewMethod === 'histogram') {
      new HistogramRangeSelectorView(
        this.#SELECT_CONTAINER,
        this.#subject,
        this.#property,
        values,
        this.#sparqlist,
        this.#OVERVIEW_CONTAINER
      );
    } else {
      new ColumnSelectorView(
        this.#SELECT_CONTAINER,
        this.#subject,
        this.#property,
        values,
        this.#sparqlist
      );
    }
  }

}
