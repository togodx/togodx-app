import App from "./App";
import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records";
import ColumnView from "./ColumnView";
import * as event from '../events';
import * as queryTemplates from '../functions/queryTemplates';

const ALL_PROPERTIES = 'ALL_PROPERTIES';

export default class ColumnSelectorView {

  #property;
  #items;
  #columns;
  #currentColumns;
  #userValues;
  #ROOT;
  #CONTAINER;
  #LOADING_VIEW;
  #ITEM_ALL_INPUT_OF_ROOT;

  constructor(elm, property, items) {

    this.#property = property;
    this.#items = {};
    this.#columns = [];
    this.#currentColumns = [];
    this.#userValues = new Map();

    // make container
    elm.innerHTML = `
    <div class="column-selector-view">
      <div class="columns">
        <div class="inner"></div>
      </div>
      <div class="loading-view"></div>
    </div>`;
    this.#ROOT = elm.querySelector(':scope > .column-selector-view');
    this.#CONTAINER = this.#ROOT.querySelector(':scope > .columns > .inner');
    this.#LOADING_VIEW = this.#ROOT.querySelector(':scope > .loading-view');

    // even listener
    DefaultEventEmitter.addEventListener(event.mutatePropertyCondition, ({detail}) => {
      if (detail.action === 'remove') {
        if (this.#property.propertyId === detail.propertyId) {
          if (detail.parentCategoryId) {
            const checkbox = this.#CONTAINER.querySelector(`[data-parent-category-id="${detail.parentCategoryId}"] > input`);
            if (checkbox) checkbox.checked = false;
          }
        }
      }
    })
    DefaultEventEmitter.addEventListener(event.mutatePropertyValueCondition, ({detail}) => {
      if (this.#property.propertyId === detail.propertyId) {
        this.#currentColumns.forEach(column => {
          let isAllChecked = true;
          column.querySelectorAll(':scope > table > tbody > .item').forEach(tr => {
            const checkbox = tr.querySelector(':scope > .label > label > input[type="checkbox"]');
            if (!checkbox.checked) isAllChecked = false;
            if (tr.dataset.id === detail.categoryId) {
              // change checkbox status
              const isChecked = detail.action === 'add';
              checkbox.checked = isChecked;
              this.#items[tr.dataset.id].checked = isChecked;
            }
          })
          // update Map attributes
          column.querySelector(':scope > table > thead > .item.-all > .label > label > input[type="checkbox"]').checked = isAllChecked;
          // change ancestor status
          // TODO:
        });
      }
    });
    DefaultEventEmitter.addEventListener(event.changeViewModes, e => this.#update(e.detail.log10));
    DefaultEventEmitter.addEventListener(event.mutatePropertyCondition, this.#mutatePropertyCondition.bind(this));
    DefaultEventEmitter.addEventListener(event.setUserValues, e => this.#setUserValues(e.detail));
    DefaultEventEmitter.addEventListener(event.clearUserValues, () => this.#clearUserValues());

    const depth = 0;
    this.#setItems(items, depth);

    // make root column
    const column = this.#makeColumn(items, depth);
    this.#appendSubColumn(column, depth);

  }

  // private methods

  #setItems(items, depth, parent) {
    for (const item of items) {
      const hasChild = item.hasChild && item.hasChild === true;
      this.#items[item.categoryId] = {
        label: item.label,
        parent,
        hasChild: hasChild ? true : false,
        depth,
        selected: false,
        checked: false
      }
      if (hasChild) this.#items[item.categoryId].children = [];
    }
  }

  #setSubColumn(categoryId, depth) {
    this.#LOADING_VIEW.classList.add('-shown');
    this.#getColumn(categoryId, depth)
      .then(column => {
        this.#appendSubColumn(column, depth);
        this.#LOADING_VIEW.classList.remove('-shown');
      })
      .catch(error => {
        // TODO: エラー処理
        this.#LOADING_VIEW.classList.remove('-shown');
        throw Error(error);
      });
  }

  #getColumn(categoryId, depth) {
    return new Promise((resolve, reject) => {
      const column = this.#columns.find(column => column.parentCategoryId === categoryId);
      if (column) {
        resolve(column.column);
      } else {
        Records.fetchPropertyValues(this.#property.propertyId, categoryId)
          .then(values => {
            this.#setItems(values, depth, categoryId);
            const column = this.#makeColumn(values, depth, categoryId);
            resolve(column);
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  }

  #makeColumn(items, depth, parentCategoryId) {
    // console.log(items, depth, parentCategoryId)

    const parentItem = parentCategoryId ? this.#items[parentCategoryId] : undefined;
    const selectedCategoryIds = ConditionBuilder.getSelectedCategoryIds(this.#property.propertyId);

    // make column
    const column = document.createElement('div');
    const isSelected = ConditionBuilder.isSelectedProperty(this.#property.propertyId, parentCategoryId);
    column.classList.add('column');
    let max = 0;
    column.innerHTML = `
    <table>
      <thead>
        <tr class="header">
          <th class="label">Values</th>
          <th class="total">Total</th>
          <th class="mapped">Mapped</th>
          <th class="pvalue">p-value</th>
          <th class="drilldown"></th>
        </tr>
        <tr
          class="item -all"
          ${
            parentCategoryId
              ? `
                data-parent-category-id="${parentCategoryId ?? ''}"
                data-parent-label="${parentItem.label}"`
              : ''
          }
          data-category-ids="${items.map(item => item.categoryId)}"
          data-depth="${depth}">
          <td class="label" colspan="5">
            <label>
              <input
                type="checkbox"
                value="${ALL_PROPERTIES}" 
                ${isSelected ? ' checked' : ''}/>
              Map following attributes
            </label>
          </td>
        </tr>
      </thead>
      <tbody>${items.map(item => {
        max = Math.max(max, item.count);
        const checked = selectedCategoryIds.indexOf(item.categoryId) !== -1
          ? ' checked'
          : '';
        return `
        <tr
          class="item${item.hasChild ? ' -haschild' : ''}"
          data-id="${item.categoryId}"
          data-category-id="${item.categoryId}"
          data-count="${item.count}">
          <td class="label">
            <label>
              <input type="checkbox" value="${item.categoryId}"${checked}/>
              ${item.label}
            </label>
          </td>
          <td class="total">${item.count.toLocaleString()}</td>
          <td class="mapped"></td>
          <td class="pvalue"></td>
          <td class="drilldown"></td>
        </tr>`;
      }).join('')}</tbody>
    </table>
    `;
    const tbody = column.querySelector(':scope > table > tbody');
    const listItems = tbody.querySelectorAll(':scope > .item');
    listItems.forEach(tr => this.#items[tr.dataset.categoryId].elm = tr);

    // drill down event
    tbody.querySelectorAll(':scope > .item.-haschild > .drilldown').forEach(drilldown => {
      drilldown.addEventListener('click', () => {
        const tr = drilldown.closest('tr');
        tr.classList.add('-selected');
        // delete an existing lower columns
        if (this.#currentColumns.length > depth + 1) {
          for (let i = depth + 1; i < this.#currentColumns.length; i++) {
            if (this.#currentColumns[i].parentNode) this.#CONTAINER.removeChild(this.#currentColumns[i]);
          }
        }
        // deselect siblings
        const selectedItemKeys = Object.keys(this.#items).filter(id => this.#items[id].selected && this.#items[id].depth >= depth);
        for (const key of selectedItemKeys) {
          this.#items[key].selected = false;
          this.#currentColumns[depth].querySelector(`[data-id="${key}"]`)?.classList.remove('-selected');
        }
        // get lower column
        this.#items[tr.dataset.id].selected = true;
        this.#setSubColumn(tr.dataset.id, depth + 1);
      });
    });

    listItems.forEach(tr => {
      // select/deselect a item (attribute) > label
      const checkbox = tr.querySelector(':scope > .label > label > input[type="checkbox"]');
      checkbox.addEventListener('click', e => {
        e.stopPropagation();
        const ancestors = [];
        let parentCategoryId;
        let column = checkbox.closest('.column');
        do { // find ancestors
          parentCategoryId = column?.querySelector(':scope > table > thead > tr.item.-all').dataset.parentCategoryId;
          if (parentCategoryId) {
            ancestors.unshift(parentCategoryId);
            column = column.previousElementSibling;
          }
        } while (parentCategoryId);
        if (checkbox.checked) { // add
          ConditionBuilder.addPropertyValue(
            this.#property.propertyId,
            checkbox.value,
            ancestors
          );
        } else { // remove
          ConditionBuilder.removePropertyValue(this.#property.propertyId, checkbox.value);
        }
      });
    });

    // Map attributes event
    const itemAllInput = column.querySelector(':scope > table > thead > .item.-all > .label > label > input');
    itemAllInput.addEventListener('change', e => {
      const parentCategoryId = e.target.closest('.item.-all').dataset.parentCategoryId;
      if (e.target.checked) {
        ConditionBuilder.addProperty(this.#property.propertyId, parentCategoryId);
      } else {
        ConditionBuilder.removeProperty(this.#property.propertyId, parentCategoryId);
      }
    });
    if (depth === 0) this.#ITEM_ALL_INPUT_OF_ROOT = itemAllInput;

    this.#columns.push({column, parentCategoryId, max});
    this.#update(App.viewModes.log10);
    return column;
  }

  #appendSubColumn(column, depth) {
    this.#currentColumns[depth] = column;
    this.#CONTAINER.append(column);
    // scroll
    const left = this.#CONTAINER.scrollWidth - this.#CONTAINER.clientWidth;
    if (left > 0) {
      this.#CONTAINER.scrollTo({
        top: 0,
        left: left,
        behavior: 'smooth'
      });
    };

    // user IDs
    if (document.body.classList.contains('-showuserids') && ConditionBuilder.userIds) {
      this.#getUserValues(
        queryTemplates.dataFromUserIds(
          this.#property.data,
          this.#property.primaryKey,
          column.querySelector(':scope > table > thead > .item.-all').dataset.parentCategoryId
          )
        )
        .then(values => {
          this.#setUserValues({
            propertyId: this.#property.propertyId,
            values
          }, true);
        });
    }
  }

  #update(isLog10) {
    this.#columns.forEach(column => {
      let max = column.max;
      max = isLog10 && max > 1 ? Math.log10(max) : max;
      column.column.querySelectorAll(':scope > table > tbody > .item').forEach(tr => {
        const count = Number(tr.dataset.count);
        const subject = Records.getSubjectWithPropertyId(this.#property.propertyId);
        tr.style.backgroundColor = `rgb(${subject.color.mix(App.colorWhite, 1 - (isLog10 ? Math.log10(count) : count) / max).coords.map(cood => cood * 256).join(',')})`;
      });
    });
  }

  #mutatePropertyCondition({detail: {action, propertyId, parentCategoryId}}) {
    if (propertyId === this.#property.propertyId) {
      this.#ITEM_ALL_INPUT_OF_ROOT.checked = action === 'add';
    }
  }

  #getUserValues(query) {
    return new Promise((resolve, reject) => {
      const values = this.#userValues.get(query);
      if (values) {
        resolve(values);
      } else {
        axios
          .get(query)
          .then(response => {
            this.#userValues.set(query, response.data);
            resolve(response.data);
          });
      }
    });
  }

  #setUserValues({propertyId, values}, bySubdirectory = false) {
    if (this.#property.propertyId === propertyId) {
      for (const value of values) {
        const item = this.#items[value.categoryId];
        if (item) {
          item.elm.classList.add('-pinsticking');
          item.elm.querySelector(':scope > .mapped').textContent = value.hit_count ? value.hit_count.toLocaleString() : '';
          item.elm.querySelector(':scope > .pvalue').textContent = value.pValue ? value.pValue.toExponential(2) : '';
          if (value.hit_count === 0) item.elm.classList.remove('-pinsticking');
          else                       item.elm.classList.add('-pinsticking');
        }
      }
      // if it doesnt called by subdirectory, get values of subdirectories
      if (!bySubdirectory) {
        this.#currentColumns.forEach((column, index) => {
          if (index > 0) {
            this.#getUserValues(
              queryTemplates.dataFromUserIds(
                this.#property.data,
                this.#property.primaryKey,
                column.querySelector(':scope > table > thead > .item.-all').dataset.parentCategoryId
                )
              )
              .then(values => {
                this.#setUserValues({
                  propertyId: this.#property.propertyId,
                  values
                }, true);
              });
            }
        });
      }
    }
  }

  #clearUserValues() {
    for (const item in this.#items) {
      this.#items[item].elm.classList.remove('-pinsticking');
    }
  }

}