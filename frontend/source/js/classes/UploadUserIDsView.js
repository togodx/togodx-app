import DefaultEventEmitter from './DefaultEventEmitter';
import ConditionBuilder from './ConditionBuilder';
import Records from './Records';
import * as event from '../events';

const PATH = 'https://integbio.jp/togosite/sparqlist/api/';
const DATA_FROM_USER_IDS = 'data_from_user_ids';

export default class UploadUserIDsView {

  #path;
  #BODY;
  #USER_IDS;

  constructor(elm, path) {

    this.#path = path;
    this.#BODY = document.querySelector('body');
    const form = elm.querySelector(':scope > form');
    this.#USER_IDS = form.querySelector(':scope > label > input');

    // atache events
    form.querySelector(':scope > .buttons > button:nth-child(1)').addEventListener('click', e => {
      e.stopPropagation();
      this.#fetch();
      return false;
    });
    form.querySelector(':scope > .buttons > button:nth-child(2)').addEventListener('click', e => {
      e.stopPropagation();
      this.#clear();
      return false;
    });

    // event listeners
    this.#USER_IDS.addEventListener('change', () => {
      console.log(this.#USER_IDS)
      console.log(this.#USER_IDS.value)
      ConditionBuilder.setUserIds(this.#USER_IDS.value);
    });

  }

  // private methods

  #fetch() {

    const queryTemplate = `${this.#path.url}?sparqlet=@@sparqlet@@&primaryKey=@@primaryKey@@&categoryIds=&userKey=${ConditionBuilder.currentTogoKey}&userIds=${encodeURIComponent(this.#USER_IDS.value)}`;

    Records.properties.forEach(property => {
      console.log(property)
      const propertyId = property.propertyId;
      fetch(queryTemplate
        .replace('@@sparqlet@@', encodeURIComponent(property.data))
        .replace('@@primaryKey@@', encodeURIComponent(property.primaryKey)))
      .then(responce => responce.json())
      .then(values => {
        console.log(values)
        this.#BODY.classList.add('-showuserids');
        // dispatch event
        const customEvent = new CustomEvent(event.setUserValues, {detail: {
          propertyId,
          values
        }});
        DefaultEventEmitter.dispatchEvent(customEvent);
      });
    });

  }

  #clear() {
    this.#BODY.classList.remove('-showuserids');
    const customEvent = new CustomEvent(event.clearUserValues);
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

}
