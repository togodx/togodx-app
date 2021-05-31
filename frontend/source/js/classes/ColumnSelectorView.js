import App from "./App";
import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
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
    DefaultEventEmitter.addEventListener(event.mutatePropertyValueCondition, e => {
      let propertyId, categoryId;
      switch (e.detail.action) {
        case 'add':
          propertyId = e.detail.condition.property.propertyId;
          categoryId = e.detail.condition.value.categoryId;
          break;
        case 'remove':
          propertyId = e.detail.propertyId;
          categoryId = e.detail.categoryId;
          break;
      }
      if (this.#property.propertyId === propertyId) {
        this.#currentColumns.forEach(ul => {
          let isAllChecked = true;
          ul.querySelectorAll(':scope > li:not(.-all)').forEach(li => {
            const checkbox = li.querySelector(':scope > input[type="checkbox"]');
            if (!checkbox.checked) isAllChecked = false;
            if (li.dataset.id === categoryId) {
              // change checkbox status
              const isChecked = e.detail.action === 'add';
              checkbox.checked = isChecked;
              this.#items[li.dataset.id].checked = isChecked;
            }
          })
          // update all properties
          ul.querySelector(':scope > .item.-all > input[type="checkbox"]').checked = isAllChecked;
          // change ancestor status

          // TODO:
        });
      }
    });
    DefaultEventEmitter.addEventListener(event.changeViewModes, e => this.#update(e.detail.log10));

    this.#setItems(items, depth);

    // make root column
    const depth = 0;
    const column = this.#makeColumn(items, depth);
    this.#appendSubColumn(column, depth);
  }

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

  #getSubColumn(id, depth) {
    const column = this.#columns.find(column => column.parentCategoryId === id);
    if (column) {
      this.#appendSubColumn(column.ul, depth);
    } else {
      // loading
      this.#LOADING_VIEW.classList.add('-shown');
      fetch(this.#sparqlist + '?categoryIds=' + id)
        .then(responce => responce.json())
        .then(json => {
          this.#setItems(json, depth, id);
          const column = this.#makeColumn(json, depth, id);
          this.#appendSubColumn(column, depth);
          this.#LOADING_VIEW.classList.remove('-shown');
        })
        .catch(error => {
          // TODO: エラー処理
          this.#LOADING_VIEW.classList.remove('-shown');
          throw Error(error);
        });
    }
  }

  #makeColumn(items, depth, parentCategoryId) {

    // make column
    const ul = document.createElement('ul');
    ul.classList.add('column');
    let max = 0;

    // make items
    ul.innerHTML = `<li class="item -all">
      <input type="checkbox" value="${ALL_PROPERTIES}"/>
      <span class="label">All properties</span>
    </li>`
    + items.map(item => {
      max = Math.max(max, item.count);
      return `<li
        class="item${item.hasChild ? ' -haschild' : ''}"
        data-id="${item.categoryId}"
        data-category-id="${item.categoryId}"
        data-count="${item.count}">
        <input type="checkbox" value="${item.categoryId}"/>
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
        // deselect siblings
        li.parentNode.childNodes.forEach(sibling => {
          if (sibling !== li) sibling.classList.remove('-selected');
        });
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
          const selectedItem = this.#currentColumns[depth].querySelector(`[data-id="${key}"]`);
          if (selectedItem) selectedItem.classList.remove('-selected');
        }
        // get lower column
        this.#items[li.dataset.id].selected = true;
        this.#getSubColumn(li.dataset.id, depth + 1);
      });
    });

    // select/deselect a item (attribute)
    listItems.forEach(li => {
      const checkbox = li.querySelector(':scope > input[type="checkbox"]');
      checkbox.addEventListener('click', e => {
        e.stopPropagation();
        if (checkbox.checked) { // add
          const ancestors = [];
          let id = checkbox.value;
          let parent;
          do { // find ancestors
            parent = this.#items[id].parent;
            if (parent) ancestors.unshift(this.#items[parent]);
            id = parent;
          } while (parent);
          ConditionBuilder.addPropertyValue({
            subject: this.#subject,
            property: this.#property,
            value: {
              categoryId: checkbox.value,
              label: this.#items[checkbox.value].label,
              ancestors: ancestors.map(ancestor => ancestor.label)
            }
          });
        } else { // remove
          ConditionBuilder.removePropertyValue(this.#property.propertyId, checkbox.value);
        }
      });
    });

    // all properties event
    ul.querySelector(':scope > .item.-all').addEventListener('change', e => {
      const isChecked = e.target.checked;
      listItems.forEach(item => {
        const checkbox = item.querySelector(':scope > input[type="checkbox"]');
        if (checkbox.checked !== isChecked) {
          checkbox.dispatchEvent(new MouseEvent('click'));
        }
      });
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
        li.style.backgroundColor = `rgb(${this.#subject.color.mix(App.colorSilver, 1 - (isLog10 ? Math.log10(count) : count) / max).coords.map(cood => cood * 256).join(',')})`;
      });
    });
  }

}