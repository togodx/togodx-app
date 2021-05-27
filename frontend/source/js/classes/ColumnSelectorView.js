import App from "./App";
import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
import * as event from '../events';

export default class ColumnSelectorView {

  #subject;
  #property;
  #sparqlist;
  #itemStatus;
  #currentColumns;
  #subColumns;
  #it__ems;
  #ROOT;
  #CONTAINER;
  #LOADING_VIEW;

  constructor(elm, subject, property, items, sparqlist) {

    this.#subject = subject;
    this.#property = property;
    this.#sparqlist = sparqlist;
    this.#itemStatus = {};
    this.#currentColumns = [];
    this.#subColumns = [];

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
          ul.querySelectorAll('li').forEach(li => {
            if (li.dataset.id === categoryId) {
              // change checkbox status
              const isChecked = e.detail.action === 'add';
              li.querySelector(':scope > input[type="checkbox"]').checked = isChecked;
              this.#itemStatus[li.dataset.id].checked = isChecked;
              // change ancestor status
              // TODO:
            }
          })
        });
      }
    });

    this.#setItems(items, 0);
    this.#addColumn(items, 0);
  }

  #setItems(items, depth, parent) {
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
      if (hasChild) this.#itemStatus[item.categoryId].children = [];
    }
    console.log(this.#itemStatus)
  }

  #addColumn(items, depth, parentCategoryId) {

    this.#it__ems = items.map(item => Object.assign({}, item));
    console.log(this.#it__ems)

    // get column element
    let ul = this.#subColumns.find(column => column.parentCategoryId === parentCategoryId);
    if (ul === undefined) {
      ul = document.createElement('ul');
      ul.classList.add('column');
      this.#currentColumns[depth] = ul;
    }
    this.#subColumns = {ul, parentCategoryId};
    console.log(this.#subColumns)

    // make items
    ul.innerHTML = items.map(item => {
      return `<li class="item${item.hasChild ? ' -haschild' : ''}" data-id="${item.categoryId}" data-category-id="${item.categoryId}">
        <input type="checkbox" value="${item.categoryId}"/>
        <span class="label">${item.label}</span>
        <span class="count">${item.count.toLocaleString()}</span>
      </li>`;
    }).join('');
    ul.querySelectorAll(':scope > .item').forEach((item, index) => {
      // this.#it__ems[index].elm = item
      console.log(item)
      this.#itemStatus[item.dataset.categoryId].elm = item;
    });
    this.#CONTAINER.insertAdjacentElement('beforeend', ul);
    console.log(this.#itemStatus)
    this.#update(App.viewModes.log10);

    // drill down event
    ul.querySelectorAll(':scope > .item.-haschild').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.add('-selected');
        // delete an existing lower columns
        if (this.#currentColumns.length > depth + 1) {
          for (let i = depth + 1; i < this.#currentColumns.length; i++) {
            if (this.#currentColumns[i].parentNode) this.#CONTAINER.removeChild(this.#currentColumns[i]);
          }
        }
        // deselect siblings
        const selectedItemKeys = Object.keys(this.#itemStatus).filter(id => this.#itemStatus[id].selected && this.#itemStatus[id].depth >= depth);
        for (const key of selectedItemKeys) {
          this.#itemStatus[key].selected = false;
          const selectedItem = this.#currentColumns[depth].querySelector(`[data-id="${key}"]`);
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
          do { // find ancestors
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
          console.log(ancestors)
        } else { // remove
          ConditionBuilder.removePropertyValue(this.#property.propertyId, checkbox.value);
        }
      });
    });

    // event listener
    // DefaultEventEmitter.addEventListener(event.changeViewModes, e => this.#update(e.detail.log10));
  }

  #makeColumn() {

  }

  #update(isLog10) {
    // let max = Math.max(...Array.from(this.#it__ems).map(item => item.count));
    // max = isLog10 ? Math.log10(max) : max;
    // this.#it__ems.forEach(item => {
    //   item.elm.style.backgroundColor = `rgb(${this.#subject.color.mix(App.colorDarkGray, 1 - (isLog10 ? Math.log10(item.count) : item.count) / max).coords.map(cood => cood * 256).join(',')})`;
    // });
  }

  #getChildren(id, depth) {
    // loading
    this.#LOADING_VIEW.classList.add('-shown');
    fetch(this.#sparqlist + '?categoryIds=' + id)
      .then(responce => responce.json())
      .then(json => {
        this.#setItems(json, depth, id);
        this.#addColumn(json, depth, id);
        this.#LOADING_VIEW.classList.remove('-shown');
        // scroll
        const gap = this.#ROOT.scrollWidth - this.#ROOT.clientWidth;
        if (gap > 0) this.#ROOT.scrollLeft = gap;
      });
  }

}