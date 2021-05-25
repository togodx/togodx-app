import App from "./App";
import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
import * as event from '../events';

export default class ColumnSelectorView {

  #subject;
  #property;
  #sparqlist;
  #itemStatus;
  #columns;
  #ROOT;
  #CONTAINER;
  #LOADING_VIEW;

  constructor(elm, subject, property, items, sparqlist) {

    this.#subject = subject;
    this.#property = property;
    this.#sparqlist = sparqlist;
    this.#itemStatus = {};
    this.#columns = [];

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
      if (this.#property.propertyId === propertyId) { // TODO: Number型になればこの処理は厳密比較に
        this.#columns.forEach(ul => {
          ul.querySelectorAll('li').forEach(li => {
            if (li.dataset.id === categoryId) { // TODO: Number型になればこの処理は厳密比較に
              const isChecked = e.detail.action === 'add';
              li.querySelector(':scope > input[type="checkbox"]').checked = isChecked;
              this.#itemStatus[li.dataset.id].checked = isChecked;
            }
          })
        });
      }
    });

    this.#addItems(items, 0);
    this.#makeColumn(items, 0);
  }

  #addItems(items, depth, parent) {
    // console.log(items, depth)
    for (const item of items) {
      const hasChild = item.hasChild && item.hasChild === true;
      this.#itemStatus[item.categoryId] = {
        label: item.label,
        parent,
        hasChild: hasChild ? true : false,
        depth,
        selected: false,
        checked: false
      }
      if (hasChild) {
        this.#itemStatus[item.categoryId].children = [];
      }
    }
    // console.log(this.#itemStatus)
  }

  #makeColumn(items, depth) {
    // console.log(items)

    this._items = items.map(item => Object.assign({}, item));

    // get column element
    let ul;
    if (this.#columns[depth]) {
      ul = this.#columns[depth];
    } else {
      ul = document.createElement('ul');
      ul.classList.add('column');
      this.#columns[depth] = ul;
    }

    // make items
    ul.innerHTML = this._items.map(item => {
      return `<li class="item${item.hasChild ? ' -haschild' : ''}" data-id="${item.categoryId}">
        <input type="checkbox" value="${item.categoryId}"/>
        <span class="label">${item.label}</span>
        <span class="count">${item.count.toLocaleString()}</span>
      </li>`;
    }).join('');
    this.#CONTAINER.insertAdjacentElement('beforeend', ul);
    ul.querySelectorAll(':scope > .item').forEach((item, index) => {
      this._items[index].elm = item;
    })
    this.#update(App.viewModes.log10);

    // drill down event
    ul.querySelectorAll(':scope > .item.-haschild').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.add('-selected');
        // delete an existing lower columns
        if (this.#columns.length > depth + 1) {
          for (let i = depth + 1; i < this.#columns.length; i++) {
            if (this.#columns[i].parentNode) this.#CONTAINER.removeChild(this.#columns[i]);
          }
        }
        // deselect siblings
        const selectedItemKeys = Object.keys(this.#itemStatus).filter(id => this.#itemStatus[id].selected && this.#itemStatus[id].depth >= depth);
        for (const key of selectedItemKeys) {
          this.#itemStatus[key].selected = false;
          const selectedItem = this.#columns[depth].querySelector(`[data-id="${key}"]`);
          if (selectedItem) selectedItem.classList.remove('-selected');
        }
        // get lower column
        this.#itemStatus[item.dataset.id].selected = true;
        this.#getChildren(item.dataset.id, depth + 1);
      });
    });

    // select/deselect a item (attribute)
    ul.querySelectorAll(':scope > .item > input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('click', e => {
        e.stopPropagation();
        if (checkbox.checked) { // add
          const ancestors = [];
          let id = checkbox.value;
          let parent;
          do {
            parent = this.#itemStatus[id].parent;
            if (parent) ancestors.unshift(this.#itemStatus[parent]);
            id = parent;
          } while (parent);
          ConditionBuilder.addPropertyValue({
            subject: this.#subject,
            property: this.#property,
            value: {
              categoryId: checkbox.value,
              label: this.#itemStatus[checkbox.value].label,
              ancestors: ancestors.map(ancestor => ancestor.label)
            }
          });
        } else { // remove
          ConditionBuilder.removePropertyValue(this.#property.propertyId, checkbox.value);
        }
      });
    });

    // event listener
    DefaultEventEmitter.addEventListener(event.changeViewModes, e => this.#update(e.detail.log10));
  }

  #update(isLog10) {
    let max = Math.max(...Array.from(this._items).map(item => item.count));
    max = isLog10 ? Math.log10(max) : max;
    this._items.forEach(item => {
      item.elm.style.backgroundColor = `hsl(${this.#subject.hue}, 75%, ${100 - (isLog10 ? Math.log10(item.count) : item.count) / max * 40}%)`;
    });
  }

  #getChildren(id, depth) {
    // loading
    this.#LOADING_VIEW.classList.add('-shown');
    fetch(this.#sparqlist + '?categoryIds=' + id)
      .then(responce => responce.json())
      .then(json => {
        this.#addItems(json, depth, id);
        this.#makeColumn(json, depth);
        this.#LOADING_VIEW.classList.remove('-shown');
        // scroll
        const gap = this.#ROOT.scrollWidth - this.#ROOT.clientWidth;
        if (gap > 0) this.#ROOT.scrollLeft = gap;
      });
  }

}