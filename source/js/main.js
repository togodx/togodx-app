import App from './classes/App';
import config from './config.json';

globalThis.togositeapp = App;
App.ready(config);
