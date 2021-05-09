(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");

    return _classApplyDescriptorGet(receiver, descriptor);
  }

  function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");

    _classApplyDescriptorSet(receiver, descriptor, value);

    return value;
  }

  function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to " + action + " private field on non-instance");
    }

    return privateMap.get(receiver);
  }

  function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
      return descriptor.get.call(receiver);
    }

    return descriptor.value;
  }

  function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
      descriptor.set.call(receiver, value);
    } else {
      if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
      }

      descriptor.value = value;
    }
  }

  function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
      throw new TypeError("attempted to get private field on non-instance");
    }

    return fn;
  }

  // import DefaultEventEmitter from "./DefaultEventEmitter";
  var CONF_PROPERTIES = 'https://raw.githubusercontent.com/dbcls/togosite/develop/config/togosite-human/properties.json';
  var CONF_TEMPLATES = 'https://raw.githubusercontent.com/dbcls/togosite/develop/config/togosite-human/templates.json';
  var CONF_AGGREGATE = 'https://raw.githubusercontent.com/dbcls/togosite/develop/config/togosite-human/aggregate.json';

  var _subjects = new WeakMap();

  var _templates = new WeakMap();

  var _drawStanzas = new WeakSet();

  var ReportApp = /*#__PURE__*/function () {
    function ReportApp() {
      _classCallCheck(this, ReportApp);

      _drawStanzas.add(this);

      _subjects.set(this, {
        writable: true,
        value: void 0
      });

      _templates.set(this, {
        writable: true,
        value: void 0
      });
    }

    _createClass(ReportApp, [{
      key: "ready",
      value: function ready() {
        var _this = this;

        var stanzaTtemplates; // load config json

        Promise.all([fetch(CONF_PROPERTIES), fetch(CONF_TEMPLATES), fetch(CONF_AGGREGATE)]).then(function (responces) {
          return Promise.all(responces.map(function (responce) {
            return responce.json();
          }));
        }).then(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 3),
              subjects = _ref2[0],
              templates = _ref2[1];
              _ref2[2];

          console.log(subjects);
          console.log(templates); // console.log(aggregate)

          stanzaTtemplates = templates;

          _classPrivateFieldSet(_this, _subjects, subjects); // set stanza scripts


          document.querySelector('head').insertAdjacentHTML('beforeend', templates.stanzas.map(function (stanza) {
            return "<script type=\"module\" src=\"".concat(stanza, "\"></script>");
          }).join('')); // get stanza templates

          return Promise.all(Object.keys(templates.templates).map(function (key) {
            return fetch(templates.templates[key]);
          }));
        }).then(function (responces) {
          return Promise.all(responces.map(function (responce) {
            return responce.text();
          }));
        }).then(function (templates) {
          console.log(templates);

          _classPrivateFieldSet(_this, _templates, Object.fromEntries(Object.keys(stanzaTtemplates.templates).map(function (stanza, index) {
            return [stanza, templates[index]];
          })));

          _classPrivateMethodGet(_this, _drawStanzas, _drawStanzas2).call(_this);
        });
      }
    }]);

    return ReportApp;
  }();

  function _drawStanzas2() {
    var _this2 = this;

    var urlVars = Object.fromEntries(window.location.search.substr(1).split('&').map(function (keyValue) {
      return keyValue.split('=');
    }));
    console.log(urlVars);
    console.log(JSON.parse(decodeURIComponent(urlVars.properties)));
    var properties = JSON.parse(decodeURIComponent(urlVars.properties));
    console.log(properties);
    var main = document.querySelector('main');

    var subjectId = _classPrivateFieldGet(this, _subjects).find(function (subject) {
      return subject.togoKey === urlVars.togoKey;
    }).subjectId;

    main.innerHTML = _classPrivateFieldGet(this, _templates)[subjectId].replace(/{{id}}/g, urlVars.id).replace(/{{type}}/g, urlVars.togoKey) + properties.map(function (property) {
      console.log(property);

      if (property === undefined) {
        return '';
      } else {
        var subject = _classPrivateFieldGet(_this2, _subjects).find(function (subject) {
          return subject.properties.some(function (subjectProperty) {
            return subjectProperty.propertyId === property.propertyId;
          });
        });

        var template = _classPrivateFieldGet(_this2, _templates)[subject.subjectId]; // TODO: 1個目のアトリビュートしか返していない


        return '<hr>' + property.attributes.map(function (attribute) {
          return template.replace(/{{id}}/g, attribute.id).replace(/{{type}}/g, property.propertyKey);
        }).join('');
      }
    }).join('');
  }

  var ReportApp$1 = new ReportApp();

  globalThis.togositeapp = ReportApp$1;
  ReportApp$1.ready();

}());
//# sourceMappingURL=report.js.map
