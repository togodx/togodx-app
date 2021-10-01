import App from './classes/App.js';

fetch('./config.json')
  .then(response => response.json())
  .then(api => {
    globalThis.togositeapp = App;
    App.ready(api);
  });
