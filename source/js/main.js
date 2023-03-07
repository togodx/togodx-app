import App from './classes/App.js';
import config from './config.json';

globalThis.togositeapp = App;
App.ready(config);
