import DefaultEventEmitter from './DefaultEventEmitter';
import Records from './Records';
import ConditionBuilder from './ConditionBuilder';
import {EVENT_setUserValues} from '../events';

const PATH = 'https://integbio.jp/togosite/sparqlist/api/';
const DATA_FROM_USER_IDS = 'data_from_user_ids';

export default class UploadIDsView {

  #BODY;
  #ROOT;
  #USER_KEY;
  #USER_IDS;

  constructor(elm) {

    this.#BODY = document.querySelector('body');
    this.#ROOT = elm;
    this.#USER_KEY = elm.querySelector('#UploadIDsUserKey');
    this.#USER_IDS = elm.querySelector('#UploadIDsUserIDs');

    elm.querySelectorAll(':scope > span').forEach(elm => {
      elm.addEventListener('click', () => {
        this.#ROOT.classList.toggle('-showingmenu');
      });
    });
    elm.querySelector(':scope > form > button').addEventListener('click', e => {
      e.stopPropagation();
      this.#ROOT.classList.remove('-showingmenu');
      this.#fetch();
      return false;
    });
  }

  #fetch() {

    const togoKey = ConditionBuilder.currentTogoKey;
    const queryTemplate = `${PATH + DATA_FROM_USER_IDS}?sparqlet=@@sparqlet@@&primaryKey=${togoKey}&categoryIds=&userKey=${this.#USER_KEY.value}&userIds=${encodeURIComponent(this.#USER_IDS.value)}`;
    console.log( queryTemplate )

    Records.properties.forEach(property => {
      const propertyId = property.propertyId;
      fetch(queryTemplate.replace('@@sparqlet@@', encodeURIComponent(PATH + propertyId)))
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





}
