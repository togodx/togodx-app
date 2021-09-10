import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from './Records';
import * as event from '../events';

export default class StatisticsView {

  #propertyId;
  #BARS;

  constructor(elm, {subject, property}) {

    this.#propertyId = property.propertyId;

    elm.classList.add('statistics-view');
    elm.dataset.subjectId = subject.subjectId;

    // make HTML
    elm.innerHTML = `<div class="statistics">
      <div class="bars"></div>
    </div>`;

    // references
    const container = elm.querySelector(':scope > .statistics');
    this.#BARS = container.querySelector(':scope > .bars');
    this.#RATES = container.querySelector(':scope > .rates');

    // event listener
    DefaultEventEmitter.addEventListener(event.addNextRows, e => this.#draw(e.detail));
  }

  /**
   * @param {TableData} detail.tableData
   * @param {Array} detail.rows
   * @param {Boolean} detail.done
   */
  #draw(detail) {
    console.log(detail)
    console.log(detail.tableData.data)
    console.log(Records.getProperty(this.#propertyId).values)

    // const data = detail.tableData.data;
    const attributes = detail.tableData.data
      .map(datum => datum.properties.find(property => property.propertyId === this.#propertyId))
      .filter(property => property !== undefined)
      .map(property => property.attributes)
      .flat()
      .map(property => property.attribute);

    const hitVlues = [];
    Records.getProperty(this.#propertyId).values.forEach(({categoryId, label, count}) => {
      const filtered = attributes.filter(attribute => attribute.categoryId === categoryId);
      if (filtered.length === 0) return;
      hitVlues.push({
        categoryId, label, count,
        hitCount: filtered.length
      })
    });
    const countMax = Math.max(...hitVlues.map(value => value.count));

    this.#BARS.innerHTML = hitVlues.map(({categoryId, label, count, hitCount}) => {
      const position = (hitCount / countMax < .5) ? ' -below' : '';
      return `
      <div class="bar">
        <div class="wholebar" style="height: ${count / countMax * 100}%;"></div>
        <div class="hitbar _subject-background-color" style="height: ${hitCount / countMax * 100}%;">
          <div class="value${position}">${hitCount.toLocaleString()}</div>
        </div>
        <div class="label">${label}</div>
      </div>`;
    }).join('');

  }

}