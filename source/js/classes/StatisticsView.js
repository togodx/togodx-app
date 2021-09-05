import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from './Records';
import * as event from '../events';

export default class StatisticsView {

  #propertyId;
  #COUNTS;
  #RATES;
  #TICKS;

  constructor(elm, {subject, property}) {

    this.#propertyId = property.propertyId;

    elm.classList.add('statistics-view');
    elm.dataset.subjectId = subject.subjectId;

    // make HTML
    elm.innerHTML = `<div class="statistics">
      <div class="counts"></div>
      <div class="rates"></div>
      <div class="ticks"></div>
    </div>`;

    // references
    const container = elm.querySelector(':scope > .statistics');
    this.#COUNTS = container.querySelector(':scope > .counts');
    this.#RATES = container.querySelector(':scope > .rates');
    this.#TICKS = container.querySelector(':scope > .ticks');

    // event listener
    DefaultEventEmitter.addEventListener(event.addNextRows, e => this.#draw(e.detail));
  }

  /**
   * @param {TableData} detail.tableData
   * @param {Array} detail.rows
   * @param {Boolean} detail.done
   */
  #draw(detail) {

    // const data = detail.tableData.data;
    const attributes = detail.tableData.data
      .map(datum => datum.properties.find(property => property.propertyId === this.#propertyId))
      .filter(property => property !== undefined)
      .map(property => property.attributes)
      .flat()
      .map(property => property.attribute);

    const categoryIds = [...new Set(attributes.map(attribute => attribute.categoryId))];
    
    // count
    const counts = categoryIds.map(categoryId => attributes.filter(attribute => attribute.categoryId === categoryId).length);
    const countMax = Math.max(...counts);
    // draw
    this.#COUNTS.innerHTML = counts.map(count => {
      const position = (count / countMax < .5) ? ' -below' : '';
      return `
      <div class="bar _subject-background-color" style="height: ${count / countMax * 100}%;">
        <div class="value${position}">${count.toLocaleString()}</div>
      </div>`;
    }).join('');

    // rate
    const rates = categoryIds.map((categoryId, index) => {
      const value = Records.getValue(this.#propertyId, categoryId);
      const sum = value.count * detail.tableData.rateOfProgress;
      return counts[index] / sum;
    });
    const rateMax = Math.max(...rates);
    // draw
    this.#RATES.innerHTML = rates.map(rate => {
      const position = (rate / rateMax < .5) ? ' -below' : '';
      return `
      <div class="bar _subject-background-color" style="height: ${rate / rateMax * 100}%;">
        <div class="value${position}">${rate.toLocaleString()}</div>
      </div>`;
    }).join('');

    // tick
    const labels = categoryIds.map(categoryId => attributes.find(attribute => attribute.categoryId === categoryId)).map(attribute => attribute.label);
    this.#TICKS.innerHTML = labels.map(label => {
      return `
      <div class="bar">
        <div class="label">${label}</div>
      </div>`;
    }).join('');
  }

}