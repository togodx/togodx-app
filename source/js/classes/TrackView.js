import DefaultEventEmitter from './DefaultEventEmitter';
import Records from './Records';
import ConditionBuilder from './ConditionBuilder';
import collapseView from '../functions/collapseView';
import ColumnSelectorView from './ColumnSelectorView';
import HistogramRangeSelectorView from './HistogramRangeSelectorView';
import TrackOverviewCategorical from './TrackOverviewCategorical';
import * as event from '../events';

export default class TrackView {
  #attribute;
  #property;
  #ROOT;
  #LOADING_VIEW;
  #SELECT_CONTAINER;
  #OVERVIEW_CONTAINER;
  #CHECKBOX_ALL_PROPERTIES;
  #COLLAPSE_BUTTON;

  constructor(attributeId, container, positionRate) {

    // this.#attributeId = attributeId;
    this.#attribute = Records.getAttribute(attributeId);
    const isSelected = ConditionBuilder.isSelectedProperty(attributeId);
    this.#ROOT = document.createElement('div');
    container.insertAdjacentElement('beforeend', this.#ROOT);
    // this.#property = property;
    const category = Records.getCategoryWithAttribute(attributeId);
    this.#ROOT.classList.add('track-view', '-preparing', 'collapse-view');
    if (isSelected) this.#ROOT.classList.add('-allselected');
    this.#ROOT.dataset.categoryId = category.id;
    // this.#ROOT.dataset.propertyId = attributeId;
    this.#ROOT.dataset.collapse = attributeId;

    // make html
    const checked = isSelected ? ' checked' : '';
    this.#ROOT.innerHTML = `
    <div class="row -upper">
      <div class="left definition">
        <div class="collapsebutton" data-collapse="${attributeId}">
          <input type="checkbox" class="mapping"${checked}>
          <h2 class="title _category-color">${this.#attribute.label}</h2>
        </div>
      </div>
      <div class="right values">
        <div class="overview _category-background-color">
          <ul class="inner"></ul>
          <div class="loading-view -shown"></div>
        </div>
      </div>
    </div>
    <div class="row -lower collapsingcontent" data-collapse="${attributeId}">
      <div class="left">
        <dl class="specification">
          <dt>Description</dt>
          <dd>${this.#attribute.description}</dd>
          <dt>API</dt>
          <dd><a href="${this.#attribute.api}" target="_blank">${this.#attribute.api}</a></dd>
          <dt>Original data</dt>
          <dd><a href="${this.#attribute.source.url}" target="_blank">${this.#attribute.source.label}</a></dd>
          <dt>Version</dt>
          <dd>${this.#attribute.source.version}</dd>
          <dt>Last updated</dt>
          <dd>${this.#attribute.source.updated}</dd>
        </dl>
      </div>
      <div class="right selector"></div>
    </div>`;
    const valuesContainer = this.#ROOT.querySelector(':scope > .row.-upper > .values');
    this.#OVERVIEW_CONTAINER = valuesContainer.querySelector(
      ':scope > .overview > .inner'
    );
    this.#LOADING_VIEW = valuesContainer.querySelector(
      ':scope > .overview > .loading-view'
    );
    this.#SELECT_CONTAINER = this.#ROOT.querySelector(
      ':scope > .row.-lower > .selector'
    );
    this.#COLLAPSE_BUTTON = this.#ROOT.querySelector(
      ':scope > .row.-upper > .left > .collapsebutton'
    );

    // collapse
    collapseView(this.#ROOT);

    // select/deselect a property
    this.#CHECKBOX_ALL_PROPERTIES = this.#ROOT.querySelector(
      ':scope > .row.-upper > .left > .collapsebutton > input.mapping'
    );
    this.#CHECKBOX_ALL_PROPERTIES.addEventListener('click', e => {
      e.stopPropagation();
      if (this.#CHECKBOX_ALL_PROPERTIES.checked) {
        // add
        ConditionBuilder.addProperty(attribute);
        this.#ROOT.classList.add('-allselected');
      } else {
        // remove
        ConditionBuilder.removeProperty(attribute);
        this.#ROOT.classList.remove('-allselected');
      }
    });
    // event listener
    DefaultEventEmitter.addEventListener(event.mutatePropertyCondition, e => {
      if (e.detail.parentCategoryId !== undefined) return;
      switch (e.detail.action) {
        case 'add':
          if (e.detail.propertyId === attribute) {
            this.#CHECKBOX_ALL_PROPERTIES.checked = true;
            this.#ROOT.classList.add('-allselected');
          }
          break;
        case 'remove':
          if (e.detail.propertyId === attribute) {
            this.#CHECKBOX_ALL_PROPERTIES.checked = false;
            this.#ROOT.classList.remove('-allselected');
          }
          break;
      }
    });
    DefaultEventEmitter.addEventListener(event.allTracksCollapse, e => {
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

    DefaultEventEmitter.addEventListener(event.toggleErrorUserValues, e => {
      if (e.detail.mode === 'show') {
        if (e.detail.propertyId !== attribute) return;
        this.#showError(e.detail.message, true);
      } else if (e.detail.mode === 'hide') this.#clearError();
    });

    // get property data
    Records.fetchPropertyValues(attributeId)
      .then(values => this.#makeValues(values))
      .catch(error => {
        console.error(error);
        this.#showError(error);
      })
      .finally(() => {
        this.#LOADING_VIEW.classList.remove('-shown');
      });
  }

  // private methods

  #makeValues(values) {
    console.log(values)
    this.#ROOT.classList.remove('-preparing');

    // make overview
    new TrackOverviewCategorical(
      this.#OVERVIEW_CONTAINER,
      this.#attribute,
      values
    );

    // // make selector view
    // if (
    //   this.#property.viewMethod &&
    //   this.#property.viewMethod === 'histogram'
    // ) {
    //   new HistogramRangeSelectorView(
    //     this.#SELECT_CONTAINER,
    //     this.#property,
    //     values,
    //     this.#OVERVIEW_CONTAINER
    //   );
    // } else {
    //   new ColumnSelectorView(
    //     this.#SELECT_CONTAINER,
    //     this.#property,
    //     values
    //   );
    // }
  }

  #showError(error, inUserIDs = false) {
    if (
      inUserIDs &&
      this.#OVERVIEW_CONTAINER.nextElementSibling?.classList.contains('error')
    )
      return;
    const prop = this.#attribute.api;

    this.#OVERVIEW_CONTAINER.insertAdjacentHTML(
      'afterEnd',
      `<div class="${
        inUserIDs ? 'map-ids ' : ''
      }error">${error} - <a href="${prop}" target="_blank">${prop}</a></div>`
    );
    if (inUserIDs) this.#OVERVIEW_CONTAINER.classList.add('-hidden');
  }

  #clearError() {
    this.#OVERVIEW_CONTAINER.classList.remove('-hidden');
    this.#OVERVIEW_CONTAINER.parentNode
      .querySelector(':scope > .map-ids.error')
      ?.remove();
  }
}
