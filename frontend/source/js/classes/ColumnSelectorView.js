import App from "./App";
import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records";
import * as event from '../events';

const ALL_PROPERTIES = 'ALL_PROPERTIES';

export default class ColumnSelectorView {

  #subject;
  #property;
  #sparqlist;
  #items;
  #columns;
  #currentColumns;
  #ROOT;
  #CONTAINER;
  #LOADING_VIEW;

  constructor(elm, subject, property, items, sparqlist) {

    this.#subject = subject;
    this.#property = property;
    this.#sparqlist = sparqlist;
    this.#items = {};
    this.#columns = [];
    this.#currentColumns = [];

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
    DefaultEventEmitter.addEventListener(event.mutatePropertyCondition, e => {
      if (e.detail.action === 'remove') {
        if (this.#property.propertyId === e.detail.propertyId) {
          if (e.detail.parentCategoryId) {
            const checkbox = this.#CONTAINER.querySelector(`[data-parent-category-id="${e.detail.parentCategoryId}"] > input`);
            if (checkbox) checkbox.checked = false;
          }
        }
      }
    })
    DefaultEventEmitter.addEventListener(event.mutatePropertyValueCondition, ({detail}) => {
      if (this.#property.propertyId === detail.propertyId) {
        this.#currentColumns.forEach(ul => {
          let isAllChecked = true;
          ul.querySelectorAll(':scope > li:not(.-all)').forEach(li => {
            const checkbox = li.querySelector(':scope > input[type="checkbox"]');
            if (!checkbox.checked) isAllChecked = false;
            if (li.dataset.id === detail.categoryId) {
              // change checkbox status
              const isChecked = detail.action === 'add';
              checkbox.checked = isChecked;
              this.#items[li.dataset.id].checked = isChecked;
            }
          })
          // update Map attributes
          ul.querySelector(':scope > .item.-all > input[type="checkbox"]').checked = isAllChecked;
          // change ancestor status
          // TODO:
        });
      }
    });
    DefaultEventEmitter.addEventListener(event.changeViewModes, e => this.#update(e.detail.log10));

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
        resolve(column.ul);
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
    const ul = document.createElement('ul');
    ul.classList.add('column');
    let max = 0;

    // make items
    ul.innerHTML = `<li
      class="item -all"
      ${parentCategoryId ? `
        data-parent-category-id="${parentCategoryId}"
        data-parent-label="${parentItem.label}"` : ''}
      data-category-ids="${items.map(item => item.categoryId)}"
      data-depth="${depth}">
      <input type="checkbox" value="${ALL_PROPERTIES}"/>
      <span class="label">Map following attributes</span>
    </li>`
    + items.map(item => {
      max = Math.max(max, item.count);
      const checked = selectedCategoryIds.indexOf(item.categoryId) !== -1 ? ' checked' : '';
      return `<li
        class="item${item.hasChild ? ' -haschild' : ''}"
        data-id="${item.categoryId}"
        data-category-id="${item.categoryId}"
        data-count="${item.count}">
        <input type="checkbox" value="${item.categoryId}"${checked}/>
        <span class="label">${item.label}</span>
        <span class="count">${item.count.toLocaleString()}</span>
      </li>`;
    }).join('');
    const listItems = ul.querySelectorAll(':scope > .item:not(.-all)');
    listItems.forEach(li => this.#items[li.dataset.categoryId].elm = li);

    // drill down event
    ul.querySelectorAll(':scope > .item.-haschild').forEach(li => {
      li.addEventListener('click', () => {
        li.classList.add('-selected');
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
        this.#items[li.dataset.id].selected = true;
        this.#setSubColumn(li.dataset.id, depth + 1);
      });
    });

    // select/deselect a item (attribute)
    listItems.forEach(li => {
      const checkbox = li.querySelector(':scope > input[type="checkbox"]');
      checkbox.addEventListener('click', e => {
        e.stopPropagation();
        if (checkbox.checked) { // add
          ConditionBuilder.addPropertyValue(
            this.#property.propertyId,
            checkbox.value
          );
        } else { // remove
          ConditionBuilder.removePropertyValue(this.#property.propertyId, checkbox.value);
        }
      });
    });

    // Map attributes event
    ul.querySelector(':scope > .item.-all').addEventListener('change', e => {
      const dataset = e.target.parentNode.dataset;
      if (e.target.checked) { // add
        ConditionBuilder.addProperty(this.#property.propertyId, dataset.parentCategoryId);
      } else { // remove
        ConditionBuilder.removeProperty(this.#property.propertyId, dataset.parentCategoryId);
      }
    });

    this.#columns.push({ul, parentCategoryId, max});
    this.#update(App.viewModes.log10);
    return ul;
  }

  #appendSubColumn(column, depth) {
    this.#currentColumns[depth] = column;
    this.#CONTAINER.insertAdjacentElement('beforeend', column);
    // scroll
    const left = this.#CONTAINER.scrollWidth - this.#CONTAINER.clientWidth;
    if (left > 0) {
      this.#CONTAINER.scrollTo({
        top: 0,
        left: left,
        behavior: 'smooth'
      });
    };
  }

  #update(isLog10) {
    this.#columns.forEach(column => {
      let max = column.max;
      max = isLog10 ? Math.log10(max) : max;
      column.ul.querySelectorAll(':scope > li:not(.-all)').forEach(li => {
        const count = Number(li.dataset.count);
        li.style.backgroundColor = `rgb(${this.#subject.color.mix(App.colorWhite, 1 - (isLog10 ? Math.log10(count) : count) / max).coords.map(cood => cood * 256).join(',')})`;
      });
    });
  }

}