import App from "./App";
import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
import * as event from '../events';

export default class ColumnSelectorView {

  constructor(elm, subject, property, items, sparqlist) {

    this._subject = subject;
    this._property = property;
    this._sparqlist = sparqlist;
    this._itemStatus = {};
    this._columns = [];

    // make container
    elm.innerHTML = `
    <div class="column-selector-view">
      <div class="columns">
        <div class="inner"></div>
      </div>
      <div class="loading-view"></div>
    </div>`;
    this._view = elm.querySelector(':scope > .column-selector-view');
    this._container = this._view.querySelector(':scope > .columns > .inner');
    this._loadingView = this._view.querySelector(':scope > .loading-view');

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
      if (this._property.propertyId == propertyId) { // TODO: Number型になればこの処理は厳密比較に
        this._columns.forEach(ul => {
          ul.querySelectorAll('li').forEach(li => {
            if (li.dataset.id == categoryId) { // TODO: Number型になればこの処理は厳密比較に
              const isChecked = e.detail.action === 'add';
              li.querySelector(':scope > input[type="checkbox"]').checked = isChecked;
              this._itemStatus[li.dataset.id].checked = isChecked;
            }
          })
        });
      }
    });

    this._addItems(items, 0);
    this._makeColumn(items, 0);
  }

  _addItems(items, depth, parent) {
    // console.log(items, depth)
    for (const item of items) {
      const hasChild = item.hasChild && item.hasChild === true;
      this._itemStatus[item.categoryId] = {
        label: item.label,
        parent,
        hasChild: hasChild ? true : false,
        depth,
        selected: false,
        checked: false
      }
      if (hasChild) {
        this._itemStatus[item.categoryId].children = [];
      }
    }
    // console.log(this._itemStatus)
  }

  _makeColumn(items, depth) {
    // console.log(items)

    this._items = items.map(item => Object.assign({}, item));

    // get column element
    let ul;
    if (this._columns[depth]) {
      ul = this._columns[depth];
    } else {
      ul = document.createElement('ul');
      ul.classList.add('column');
      this._columns[depth] = ul;
    }

    // make items
    ul.innerHTML = this._items.map(item => {
      return `<li class="item${item.hasChild ? ' -haschild' : ''}" data-id="${item.categoryId}">
        <input type="checkbox" value="${item.categoryId}"/>
        <span class="label">${item.label}</span>
        <span class="count">${item.count.toLocaleString()}</span>
      </li>`;
    }).join('');
    this._container.insertAdjacentElement('beforeend', ul);
    ul.querySelectorAll(':scope > .item').forEach((item, index) => {
      this._items[index].elm = item;
    })
    this._update(App.viewModes.log10);

    // drill down event
    ul.querySelectorAll(':scope > .item.-haschild').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.add('-selected');
        // delete an existing lower columns
        if (this._columns.length > depth + 1) {
          for (let i = depth + 1; i < this._columns.length; i++) {
            if (this._columns[i].parentNode) this._container.removeChild(this._columns[i]);
          }
        }
        // deselect siblings
        const selectedItemKeys = Object.keys(this._itemStatus).filter(id => this._itemStatus[id].selected && this._itemStatus[id].depth >= depth);
        for (const key of selectedItemKeys) {
          this._itemStatus[key].selected = false;
          const selectedItem = this._columns[depth].querySelector(`[data-id="${key}"]`);
          if (selectedItem) selectedItem.classList.remove('-selected');
        }
        // get lower column
        this._itemStatus[item.dataset.id].selected = true;
        this._getChildren(item.dataset.id, depth + 1);
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
            parent = this._itemStatus[id].parent;
            if (parent) ancestors.unshift(this._itemStatus[parent]);
            id = parent;
          } while (parent);
          ConditionBuilder.addPropertyValue({
            subject: this._subject,
            property: this._property,
            value: {
              categoryId: checkbox.value,
              label: this._itemStatus[checkbox.value].label,
              ancestors: ancestors.map(ancestor => ancestor.label)
            }
          });
        } else { // remove
          ConditionBuilder.removePropertyValue(this._property.propertyId, checkbox.value);
        }
      });
    });

    // event listener
    DefaultEventEmitter.addEventListener(event.changeViewModes, e => this._update(e.detail.log10));
  }

  _update(isLog10) {
    let max = Math.max(...Array.from(this._items).map(item => item.count));
    max = isLog10 ? Math.log10(max) : max;
    this._items.forEach(item => {
      item.elm.style.backgroundColor = `hsl(${this._subject.hue}, 75%, ${100 - (isLog10 ? Math.log10(item.count) : item.count) / max * 40}%)`;
    });
  }

  _getChildren(id, depth) {
    // loading
    this._loadingView.classList.add('-shown');
    fetch(this._sparqlist + '?categoryIds=' + id)
      .then(responce => responce.json())
      .then(json => {
        this._addItems(json, depth, id);
        this._makeColumn(json, depth);
        this._loadingView.classList.remove('-shown');
        // scroll
        const gap = this._view.scrollWidth - this._view.clientWidth;
        if (gap > 0) this._view.scrollLeft = gap;
      });
  }

}