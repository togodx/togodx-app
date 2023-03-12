import ConditionBuilder from './ConditionBuilder';
import DefaultEventEmitter from './DefaultEventEmitter';
import Records from './Records';
import App from './App';
import * as event from '../events';
import {getApiParameter} from '../functions/queryTemplates';
import axios from 'axios';

const NUM_OF_PREVIEW = 5;
// const mode = {
//   preview: 0,
//   show: 1,
// };
const displayMap = new Map([
  ['properties', 'results'],
  ['results', 'properties'],
]);

export default class ResultsView {
  #ROOT;
  #HEADER;
  #COLLAPSE_BUTTON;
  #THEAD;
  #THEAD_SUB;
  #TBODY;
  #TABLE_END;
  #source;
  #header;
  // #mode; // 'preview' or 'show'

  constructor(elm) {
    this.#ROOT = elm;
    const header = elm.querySelector(':scope > header');
    this.#HEADER = header.querySelector(':scope > span');
    this.#COLLAPSE_BUTTON = header.querySelector(
      ':scope > .collapsenotchbutton'
    );
    const TABLE = elm.querySelector(':scope > .inner > table');
    this.#THEAD = TABLE.querySelector(':scope > thead > tr.header');
    this.#THEAD_SUB = TABLE.querySelector(':scope > thead > tr.subheader');
    this.#TBODY = TABLE.querySelector(':scope > tbody');
    this.#TABLE_END = elm.querySelector(':scope > .tableend');
    const cancelToken = axios.CancelToken;
    this.#source = cancelToken.source();
    // this.#mode = mode.preview;

    // attach event
    this.#COLLAPSE_BUTTON.addEventListener('click', () => {
      const currentDisplay = document.body.dataset.display;
      document.body.dataset.display = displayMap.get(currentDisplay);
      if (currentDisplay === 'properties')
        ConditionBuilder.makeQueryParameter();
    });

    // event listeners
    DefaultEventEmitter.addEventListener(
      event.mutateEstablishConditions,
      this.#mutatedConditions.bind(this)
    );
  }

  #mutatedConditions() {
    const dxCondition = ConditionBuilder.dxCondition;
    document.body.dataset.numberOfResults = 0;
    axios
      .post(
        App.getApiUrl('aggregate'),
        getApiParameter('aggregate', {
          dataset: dxCondition.togoKey,
          filters: dxCondition.queryFilters,
          queries: ConditionBuilder.userIds,
        }),
        {cancelToken: this.#source.token}
      )
      .then(response => {
        this.#header = [
          ...dxCondition.conditionFilters.map(({categoryId, attributeId}) => {
            return {categoryId, attributeId};
          }),
          ...dxCondition.conditionAnnotations.map(
            ({categoryId, attributeId}) => {
              return {categoryId, attributeId};
            }
          ),
        ];
        this.#makeTableHeader(dxCondition, response.data);
        this.#getProperties(dxCondition, response.data);
      });
  }

  #makeTableHeader(dxCondition, ids) {
    // header
    this.#HEADER.innerHTML = `Found ${ids.length.toLocaleString()} entit${
      ids.length < 2 ? 'y' : 'ies'
    }`;
    // make table header
    this.#THEAD.innerHTML = `
      <th rowspan="2">
        <div class="inner">
          <div class="togo-key-view">${Records.getDatasetLabel(
            dxCondition.togoKey
          )}</div>
        </div>
      </th>
      <th colspan="100%">
        <div class="inner -noborder"></div>
      </th>
      `;
    // makte table sub header
    this.#THEAD_SUB.innerHTML = `
    ${dxCondition.conditionFilters
      .map(conditionFilter => {
        return `
          <th>
            <div class="inner _category-background-color" data-category-id="${
              conditionFilter.categoryId
            }">
              <div class="togo-key-view">${Records.getDatasetLabel(
                conditionFilter.dataset
              )}</div>
              <span>${conditionFilter.label}</span>
            </div>
          </th>`;
      })
      .join('')}
    ${dxCondition.conditionAnnotations
      .map(
        conditionAnnotation => `
          <th>
            <div class="inner _category-color" data-category-id="${
              conditionAnnotation.categoryId
            }">
              <div class="togo-key-view">${Records.getDatasetLabel(
                conditionAnnotation.dataset
              )}</div>
              <span>${conditionAnnotation.label}</span>
            </div>
          </th>`
      )
      .join('')}`;
  }

  #getProperties(dxCondition, ids) {
    document.body.dataset.numberOfResults = ids.length;
    const previewIds = ids.slice(0, NUM_OF_PREVIEW);
    axios
      .post(
        App.getApiUrl('dataframe'),
        getApiParameter('dataframe', {
          dataset: dxCondition.togoKey,
          filters: dxCondition.queryFilters,
          annotations: dxCondition.queryAnnotations,
          queries: previewIds,
        }),
        {cancelToken: this.#source.token}
      )
      .then(response => {
        this.#makeTableBody(dxCondition, response.data);
      });
  }

  #makeTableBody(dxCondition, rows) {
    // make table
    this.#TBODY.innerHTML = rows
      .map((row, index) => {
        return `
      <tr
        data-index="${index}"
        data-togo-id="${row.index.entry}">
        <td>
          <div class="inner">
            <ul>
              <div
                class="togo-key-view primarykey"
                data-key="${dxCondition.togoKey}"
                data-order="${[0, index]}"
                data-sub-order="0"
                data-subject-id="primary"
                data-unique-entry-id="${row.index.entry}">${row.index.entry}
              </div>
              <span>${row.index.label}</span>
            </ul>
          </div<
        </td>
        ${row.attributes
          .map((column, columnIndex) => {
            if (column) {
              return `
              <td><div class="inner"><ul>${column.items
                .map((item, itemIndex) => {
                  return `
                  <li>
                    <div
                      class="togo-key-view"
                      data-order="${[columnIndex + 1, index]}"
                      data-sub-order="${itemIndex}"
                      data-key="${item.dataset}"
                      data-subject-id="${this.#header[columnIndex].categoryId}"
                      data-main-category-id="${
                        this.#header[columnIndex].attributeId
                      }"
                      data-sub-category-id="${item.node}"
                      data-unique-entry-id="${item.entry}"
                      >${item.entry}</div>
                    <span>${item.label}</span>
                  </li>`;
                })
                .join('')}</ul></div></td>`;
            } else {
              return `<td><div class="inner -empty"></div></td>`;
            }
          })
          .join('')}
      </tr>`;
      })
      .join('');
  }
}
