import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records";
import ConditionBuilder from "./ConditionBuilder";

const PATH = 'https://integbio.jp/togosite/sparqlist/api/';
const DATA_FROM_USER_IDS = 'data_from_user_ids';

export default class UploadIDsView {

  #ROOT;
  #SPARQLET;
  // #PRIMARY_KEY;
  #USER_KEY;
  #USER_IDS;

  constructor(elm) {

    this.#ROOT = elm;
    this.#SPARQLET = elm.querySelector('#UploadIDsSparqlet');
    // this.#PRIMARY_KEY = elm.querySelector('#UploadIDsPrimaryKey');
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
    console.log( Records.properties )
    console.log(ConditionBuilder)
    const togoKey = ConditionBuilder.currentTogoKey;
    const queryTemplate = `${PATH + DATA_FROM_USER_IDS}?sparqlet=@@sparqlet@@&primaryKey=${togoKey}&categoryIds=&userKey=${this.#USER_KEY.value}&userIds=${encodeURIComponent(this.#USER_IDS.value)}`;
    console.log( queryTemplate )


    Records.properties.forEach(property => {
      const propertyId = property.propertyId;
      console.log(propertyId)
      fetch(queryTemplate.replace('@@sparqlet@@', encodeURIComponent(PATH + propertyId)))
      .then(responce => responce.json())
      .then(values => {
        console.log(values)
        // dispatch event
        const event = new CustomEvent('userValues', {detail: {
          propertyId,
          values
        }});
        DefaultEventEmitter.dispatchEvent(event);
      });
    });


    // const propertyId = this.#SPARQLET.value;
    // const togoKey = ConditionBuilder.currentTogoKey;
    // fetch(`${PATH + DATA_FROM_USER_IDS}?sparqlet=${encodeURIComponent(PATH + propertyId)}&primaryKey=${togoKey}&categoryIds=&userKey=${this.#USER_KEY.value}&userIds=${encodeURIComponent(this.#USER_IDS.value)}`)
    // .then(responce => responce.json())
    // .then(values => {
    //   console.log(values)
    //   // dispatch event
    //   const event = new CustomEvent('userValues', {detail: {
    //     propertyId,
    //     values
    //   }});
    //   DefaultEventEmitter.dispatchEvent(event);
    // });
  }





}
