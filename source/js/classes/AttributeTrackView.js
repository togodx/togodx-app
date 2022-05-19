import DefaultEventEmitter from './DefaultEventEmitter';
import Records from './Records';
import ConditionBuilder from './ConditionBuilder';
import collapseView from '../functions/collapseView';
import ColumnSelectorView from './ColumnSelectorView';
import HistogramRangeSelectorView from './HistogramRangeSelectorView';
import TrackOverviewCategorical from './TrackOverviewCategorical';
import * as event from '../events';

export default class AttributeTrackView {
  #attribute;
  #ROOT;
  #LOADING_VIEW;
  #SELECT_CONTAINER;
  #OVERVIEW_CONTAINER;
  #CHECKBOX_ALL_PROPERTIES;
  #COLLAPSE_BUTTON;

  constructor(attributeId, container, positionRate) {

    this.#attribute = Records.getAttribute(attributeId);
    this.#ROOT = document.createElement('div');
    container.insertAdjacentElement('beforeend', this.#ROOT);
    const category = Records.getCatexxxgoryWithAttributeId(attributeId);
    this.#ROOT.classList.add('attribute-track-view', '-preparing', 'collapse-view');
    this.#ROOT.dataset.catexxxgoryId = category.id;
    this.#ROOT.dataset.collapse = attributeId;

    // make html
    this.#ROOT.innerHTML = `
    <div class="row -upper">
      <div class="left definition">
        <div class="collapsebutton" data-collapse="${attributeId}">
          <input type="checkbox" class="mapping">
          <h2 class="title _catexxxgory-color">${this.#attribute.label}</h2>
        </div>
      </div>
      <div class="right values">
        <div class="overview _catexxxgory-background-color">
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
        </dl>
        ${this.#attribute.source.map(source => `<dl class="source">
        <dt>Original data</dt>
          <dd><a href="${source.url}" target="_blank">${source.label}</a></dd>
          <dt>Version</dt>
          <dd>${source.version}</dd>
          <dt>Last updated</dt>
          <dd>${source.updated}</dd>
        </dl>`).join('')}
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
        ConditionBuilder.addAttribute(attributeId);
        this.#ROOT.classList.add('-allselected');
      } else {
        // remove
        ConditionBuilder.removeAttribute(attributeId);
        this.#ROOT.classList.remove('-allselected');
      }
    });
    // event listener
    DefaultEventEmitter.addEventListener(event.mutateAttributeCondition, ({detail: {action, conditionAnnotation}}) => {
      if (conditionAnnotation.parentNode !== undefined) return;
      switch (action) {
        case 'add':
          if (conditionAnnotation.attributeId === attributeId) {
            this.#CHECKBOX_ALL_PROPERTIES.checked = true;
            this.#ROOT.classList.add('-allselected');
          }
          break;
        case 'remove':
          if (conditionAnnotation.attributeId === attributeId) {
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
        if (e.detail.attributeId !== attributeId) return;
        this.#showError(e.detail.message, true);
      } else if (e.detail.mode === 'hide') this.#clearError();
    });

    // get property data
    Records.fetchAttributeValues(attributeId)
      .then(values => this.#makeValues(values))
      .catch(error => {
        console.log(this)
        console.error(error)
        this.#showError(error);
      })
      .finally(() => {
        this.#LOADING_VIEW.classList.remove('-shown');
      });
  }

  // private methods

  #makeValues(values) {
    this.#ROOT.classList.remove('-preparing');

    // make overview
    new TrackOverviewCategorical(
      this.#OVERVIEW_CONTAINER,
      this.#attribute,
      values
    );

    // make selector view
    switch (this.#attribute.datamodel) {
      case 'classification':
        new ColumnSelectorView(
          this.#SELECT_CONTAINER,
          this.#attribute,
          values
        );
        break;
      case 'distribution':
        new HistogramRangeSelectorView(
          this.#SELECT_CONTAINER,
          this.#attribute,
          values
        );
        break;
    }
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
