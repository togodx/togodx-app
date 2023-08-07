import App from './classes/App.ts';
import config from './config.json';

globalThis.togositeapp = App;
App.ready(config);
