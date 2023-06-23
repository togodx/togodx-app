import DefaultEventEmitter from './DefaultEventEmitter.ts';
import Records from './Records.ts';
import ConditionBuilder from './ConditionBuilder.ts';
import collapseView from '../functions/collapseView.js';
import ColumnSelectorView from './ColumnSelectorView.js';
import HistogramRangeSelectorView from './HistogramRangeSelectorView.ts';
import TrackOverviewCategorical from './TrackOverviewCategorical.js';
import ConditionAnnotationUtility from './ConditionAnnotationUtility.ts';
import * as events from '../events.js';
import {CategoryBrowserView} from './CategoryBrowserView/CategoryBrowserView.js';
import { AttributesCategory } from '../interfaces.ts';
import AttributeUtility from './AttributeUtility.ts';

export default class AttributeTrackView {
  #attribute:               AttributeUtility;
  #madeFilters:             boolean;
  #ROOT:                    HTMLDivElement;
  #LOADING_VIEW:            HTMLDivElement;
  #SELECT_CONTAINER:        HTMLDivElement;
  #OVERVIEW_CONTAINER:      HTMLUListElement;
  #CHECKBOX_ALL_PROPERTIES: HTMLInputElement;
  #CHECKBOX_VISIBILITY:     HTMLInputElement;
  #COLLAPSE_BUTTON:         HTMLDivElement;

  constructor(attributeId: string, container: HTMLDivElement, displayed: boolean, positionRate: number) {
    this.#attribute = Records.getAttribute(attributeId);
    this.#madeFilters = false;
    this.#ROOT = document.createElement('div');
    container.insertAdjacentElement('beforeend', this.#ROOT);
    const category = Records.getCategoryWithAttributeId(attributeId) as AttributesCategory;
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

    const rowupper = this.#ROOT.querySelector(':scope > .row.-upper') as HTMLDivElement;
    const overview = rowupper.querySelector(':scope > .filters > .overview') as HTMLDivElement;
    this.#OVERVIEW_CONTAINER = overview.querySelector(':scope > .inner') as HTMLUListElement;
    this.#LOADING_VIEW = overview.querySelector(':scope > .loading-view') as HTMLDivElement;
    this.#SELECT_CONTAINER = this.#ROOT.querySelector(
      ':scope > .row.-lower > .selector'
    ) as HTMLDivElement;
    this.#COLLAPSE_BUTTON = rowupper.querySelector(
      ':scope > .left > .collapsebutton'
    ) as HTMLDivElement;
    this.#CHECKBOX_ALL_PROPERTIES = this.#COLLAPSE_BUTTON.querySelector(
      ':scope > input.mapping'
    ) as HTMLInputElement;
    this.#CHECKBOX_VISIBILITY = this.#COLLAPSE_BUTTON.querySelector(
      ':scope > input.visibility'
    ) as HTMLInputElement;
    if (!displayed) {
      this.#CHECKBOX_VISIBILITY.checked = false;
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
      } else {
        // remove
        ConditionBuilder.removeAnnotation(
          new ConditionAnnotationUtility(attributeId)
        );
      }
      this.#ROOT.classList.toggle('-allselected', this.#CHECKBOX_ALL_PROPERTIES.checked);
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
      events.mutateAnnotationCondition,
      this.#mutateAnnotationCondition.bind(this) as EventListener
    );
    DefaultEventEmitter.addEventListener(
      events.allTracksCollapse,
      this.#allTracksCollapse.bind(this) as EventListener
    );
    DefaultEventEmitter.addEventListener(
      events.toggleErrorUserFilters,
      this.#toggleErrorUserFilters.bind(this) as EventListener
    );

    DefaultEventEmitter.addEventListener(
      events.changeDisplayedAttributeSet,
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

  #mutateAnnotationCondition(event: CustomEvent) {
    const {action, conditionUtilityAnnotation} = event.detail;
    // ({detail: {action, conditionUtilityAnnotation}}) => {
    if (conditionUtilityAnnotation.parentNode !== undefined) return;
    switch (action) {
      case 'add':
        if (conditionUtilityAnnotation.attributeId === this.#attribute.id) {
          this.#CHECKBOX_ALL_PROPERTIES.checked = true;
          this.#ROOT.classList.add('-allselected');
        }
        break;
      case 'remove':
        if (conditionUtilityAnnotation.attributeId === this.#attribute.id) {
          this.#CHECKBOX_ALL_PROPERTIES.checked = false;
          this.#ROOT.classList.remove('-allselected');
        }
        break;
    }
  }

  #allTracksCollapse(event: CustomEvent) {
    if (event.detail) {
      if (!this.#ROOT.classList.contains('-spread')) {
        this.#COLLAPSE_BUTTON.dispatchEvent(new MouseEvent('click'));
      }
    } else {
      if (this.#ROOT.classList.contains('-spread')) {
        this.#COLLAPSE_BUTTON.dispatchEvent(new MouseEvent('click'));
      }
    }
  }

  #toggleErrorUserFilters(event: CustomEvent) {
    if (event.detail.mode === 'show') {
      if (event.detail.attributeId !== this.#attribute.id) return;
      this.#showError(event.detail.message, true);
    } else if (event.detail.mode === 'hide') this.#clearError();
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

  // accessor
  get id() {
    return this.#attribute.id;
  }
  get visibility(): boolean  {
    return this.#CHECKBOX_VISIBILITY.checked;
  }
  set visibility(visible) {
    this.#CHECKBOX_VISIBILITY.checked = visible;
    this.#ROOT.classList.toggle('-hidden', !visible);
    if (visible) this.makeFilters();
    // TODO: If :has() is supported in Firefox in the future, stop using the -hidden class
  }
}
