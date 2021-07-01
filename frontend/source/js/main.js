import App from './classes/App.js';

fetch('./api.json')
  .then(response => response.json())
  .then(api => {
    globalThis.togositeapp = App;
    App.ready(api);
  });
