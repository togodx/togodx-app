import DefaultEventEmitter from './DefaultEventEmitter.ts';
import Records from './Records.ts';
import ConditionBuilder from './ConditionBuilder.ts';
import collapseView from '../functions/collapseView.js';
import ColumnSelectorView from './ColumnSelectorView.js';
import HistogramRangeSelectorView from './HistogramRangeSelectorView.ts';
import TrackOverviewCategorical from './TrackOverviewCategorical.js';
import ConditionAnnotationUtility from './ConditionAnnotationUtility.ts';
import * as event from '../events.js';
import {CategoryBrowserView} from './CategoryBrowserView/CategoryBrowserView.js';

export default class AttributeTrackView {
  #attribute;
  #madeFilters;
  #ROOT;
  #LOADING_VIEW;
  #SELECT_CONTAINER;
  #OVERVIEW_CONTAINER;
  #CHECKBOX_ALL_PROPERTIES;
  #CHECKBOX_VISIBILITY;
  #COLLAPSE_BUTTON;

  constructor(attributeId, container, displayed, positionRate) {
    this.#attribute = Records.getAttribute(attributeId);
    this.#madeFilters = false;
    this.#ROOT = document.createElement('div');
    container.insertAdjacentElement('beforeend', this.#ROOT);
    const category = Records.getCategoryWithAttributeId(attributeId);
    this.#ROOT.classList.add(
      'attribute-track-view',
      '-preparing',
      'collapse-view'
    );
    this.#ROOT.dataset.categoryId = category.id;
    this.#ROOT.dataset.collapse = attributeId;

    // make html
    this.#ROOT.innerHTML = `
    <div class="row -upper">
      <div class="left definition">
        <div class="collapsebutton" data-collapse="${attributeId}">
          <input type="checkbox" class="mapping">
          <input type="checkbox" class="visibility"${
            displayed ? ' checked' : ''
          }>
          <h2 class="title _category-color">${this.#attribute.label}</h2>
        </div>
      </div>
      <div class="right filters">
        <div class="overview _category-background-color">
          <ul class="inner"></ul>
          <div class="loading-view -shown"></div>
        </div>
      </div>
    </div>
    <div class="row -lower collapsingcontent" data-collapse="${attributeId}">
      <div class="left">
        <dl class="specification">
          <dd>${this.#attribute.description}</dd>
        </dl>
        ${this.#attribute.source
          .map(
            source => `
        <dl class="source">
          <dt>Original data</dt>
            <dd><a href="${source.url}" target="_blank">${source.label}</a></dd>
            ${
              source.version ? `<dt>Version</dt><dd>${source.version}</dd>` : ''
            }
            ${
              source.updated
                ? `<dt>Last updated</dt><dd>${source.updated}</dd>`
                : ''
            }
        </dl>`
          )
          .join('')}
      </div>
      <div class="right selector"></div>
    </div>`;

    // references

    const rowupper = this.#ROOT.querySelector(':scope > .row.-upper');
    const overview = rowupper.querySelector(':scope > .filters > .overview');
    this.#OVERVIEW_CONTAINER = overview.querySelector(':scope > .inner');
    this.#LOADING_VIEW = overview.querySelector(':scope > .loading-view');
    this.#SELECT_CONTAINER = this.#ROOT.querySelector(
      ':scope > .row.-lower > .selector'
    );
    this.#COLLAPSE_BUTTON = rowupper.querySelector(
      ':scope > .left > .collapsebutton'
    );
    this.#CHECKBOX_ALL_PROPERTIES = this.#COLLAPSE_BUTTON.querySelector(
      ':scope > input.mapping'
    );
    this.#CHECKBOX_VISIBILITY = this.#COLLAPSE_BUTTON.querySelector(
      ':scope > input.visibility'
    );
    if (!displayed) {
      this.#CHECKBOX_VISIBILITY.ckecked = false;
      this.#ROOT.classList.add('-hidden');
    }

    // collapse
    collapseView(this.#ROOT);

    // select/deselect a property
    this.#CHECKBOX_ALL_PROPERTIES.addEventListener('click', e => {
      e.stopPropagation();
      if (this.#CHECKBOX_ALL_PROPERTIES.checked) {
        // add
        ConditionBuilder.addAnnotation(
          new ConditionAnnotationUtility(attributeId)
        );
        this.#ROOT.classList.add('-allselected');
      } else {
        // remove
        ConditionBuilder.removeAnnotation(
          new ConditionAnnotationUtility(attributeId)
        );
        this.#ROOT.classList.remove('-allselected');
      }
    });

    // visibility
    this.#CHECKBOX_VISIBILITY.addEventListener('click', e => {
      e.stopPropagation();
      this.#ROOT.classList.toggle(
        '-hidden',
        !this.#CHECKBOX_VISIBILITY.checked
      );
      // TODO: If :has() is supported in Firefox in the future, stop using the -hidden class
    });

    // event listener
    DefaultEventEmitter.addEventListener(
      event.mutateAnnotationCondition,
      ({detail: {action, conditionUtilityAnnotation}}) => {
        if (conditionUtilityAnnotation.parentNode !== undefined) return;
        switch (action) {
          case 'add':
            if (conditionUtilityAnnotation.attributeId === attributeId) {
              this.#CHECKBOX_ALL_PROPERTIES.checked = true;
              this.#ROOT.classList.add('-allselected');
            }
            break;
          case 'remove':
            if (conditionUtilityAnnotation.attributeId === attributeId) {
              this.#CHECKBOX_ALL_PROPERTIES.checked = false;
              this.#ROOT.classList.remove('-allselected');
            }
            break;
        }
      }
    );
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

    DefaultEventEmitter.addEventListener(event.toggleErrorUserFilters, e => {
      if (e.detail.mode === 'show') {
        if (e.detail.attributeId !== attributeId) return;
        this.#showError(e.detail.message, true);
      } else if (e.detail.mode === 'hide') this.#clearError();
    });

    DefaultEventEmitter.addEventListener(
      event.changeDisplayedAttributeSet,
      e => {
        const displayed = e.detail.indexOf(attributeId) >= 0;
        this.visibility = displayed;
      }
    );

    // make filters
    if (displayed) this.makeFilters();
  }

  // public methods

  async makeFilters() {
    if (this.#madeFilters) return;
    this.#madeFilters = true;

    const filters = await Records.fetchChildNodes(this.#attribute.id).catch(
      err => {
        console.error(err);
        this.#showError(err);
      }
    );
    this.#LOADING_VIEW.classList.remove('-shown');
    this.#ROOT.classList.remove('-preparing');
    if (!filters) return;

    // make overview
    new TrackOverviewCategorical(
      this.#OVERVIEW_CONTAINER,
      this.#attribute,
      filters
    );

    // make selector view
    switch (this.#attribute.datamodel) {
      case 'classification':
        if (filters.some(filter => !filter.tip)) {
          new CategoryBrowserView(
            this.#SELECT_CONTAINER,
            this.#attribute,
            filters
          );
        } else {
          new ColumnSelectorView(
            this.#SELECT_CONTAINER,
            this.#attribute,
            filters
          );
        }
        break;
      case 'distribution':
        new HistogramRangeSelectorView(
          this.#SELECT_CONTAINER,
          this.#attribute,
          filters
        );
        break;
    }
  }

  // private methods

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

  // accessor
  get id() {
    return this.#attribute.id;
  }
  get visibility() {
    return this.#CHECKBOX_VISIBILITY.checked;
  }
  set visibility(visible) {
    this.#CHECKBOX_VISIBILITY.checked = visible;
    this.#ROOT.classList.toggle('-hidden', !visible);
    if (visible) this.makeFilters();
    // TODO: If :has() is supported in Firefox in the future, stop using the -hidden class
  }
}