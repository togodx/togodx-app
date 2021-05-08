import DefaultEventEmitter from './DefaultEventEmitter';
import Records from './Records';
import {EVENT_setUserValues, EVENT_clearUserValues} from '../events';

const PATH = 'https://integbio.jp/togosite/sparqlist/api/';
const DATA_FROM_USER_IDS = 'data_from_user_ids';

export default class UploadUserIDsView {

  #BODY;
  #ROOT;
  #USER_KEY;
  #USER_IDS;

  constructor(elm) {

    this.#BODY = document.querySelector('body');
    this.#ROOT = elm;
    this.#USER_KEY = elm.querySelector('#UploadUserIDsUserKey');
    this.#USER_IDS = elm.querySelector('#UploadUserIDsUserIDs');

    elm.querySelectorAll(':scope > span').forEach(elm => {
      elm.addEventListener('click', () => {
        this.#ROOT.classList.toggle('-showingmenu');
      });
    });

    // atache events
    elm.querySelector(':scope > form > button#UploadUserIDsSubmit').addEventListener('click', e => {
      e.stopPropagation();
      this.#ROOT.classList.remove('-showingmenu');
      this.#fetch();
      return false;
    });
    elm.querySelector(':scope > form > button#UploadUserIDsClear').addEventListener('click', e => {
      e.stopPropagation();
      this.#ROOT.classList.remove('-showingmenu');
      this.#clear();
      return false;
    });
  }

  #fetch() {

    const queryTemplate = `${PATH + DATA_FROM_USER_IDS}?sparqlet=@@sparqlet@@&primaryKey=@@primaryKey@@&categoryIds=&userKey=${this.#USER_KEY.value}&userIds=${encodeURIComponent(this.#USER_IDS.value)}`;

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
        const event = new CustomEvent(EVENT_setUserValues, {detail: {
          propertyId,
          values
        }});
        DefaultEventEmitter.dispatchEvent(event);
      });
    });

  }

  #clear() {
    this.#BODY.classList.remove('-showuserids');
    const event = new CustomEvent(EVENT_clearUserValues);
    DefaultEventEmitter.dispatchEvent(event);
  }

}
