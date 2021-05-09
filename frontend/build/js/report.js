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

  var _subjects = new WeakMap();

  var _properties = new WeakMap();

  var Records = /*#__PURE__*/function () {
    function Records() {
      _classCallCheck(this, Records);

      _subjects.set(this, {
        writable: true,
        value: void 0
      });

      _properties.set(this, {
        writable: true,
        value: void 0
      });
    } // public methods


    _createClass(Records, [{
      key: "setSubjects",
      value: function setSubjects(subjects) {
        var _this = this;

        // define subjects
        for (var i = 0; i < subjects.length; i++) {
          var hue = 360 - 360 * i / subjects.length + 180;
          hue -= hue > 360 ? 360 : 0;
          subjects[i].hue = hue;
        }

        _classPrivateFieldSet(this, _subjects, Object.freeze(subjects)); // set properties


        _classPrivateFieldSet(this, _properties, []);

        subjects.forEach(function (subject) {
          subject.properties.forEach(function (property) {
            _classPrivateFieldGet(_this, _properties).push(Object.assign({
              subjectId: subject.subjectId
            }, property));
          });
        });
        console.log(_classPrivateFieldGet(this, _subjects));
        console.log(_classPrivateFieldGet(this, _properties));
      }
    }, {
      key: "setValues",
      value: function setValues(propertyId, values) {
        var property = _classPrivateFieldGet(this, _properties).find(function (property) {
          return property.propertyId === propertyId;
        });

        property.values = values;
      }
    }, {
      key: "getProperty",
      value: function getProperty(propertyId) {
        console.log(propertyId);

        var property = _classPrivateFieldGet(this, _properties).find(function (property) {
          return property.propertyId === propertyId;
        });

        console.log(property);
        return property;
      }
    }, {
      key: "getValue",
      value: function getValue(propertyId, categoryId) {
        // const property = this.#properties.find(property => property.propertyId === propertyId);
        var property = this.getProperty(propertyId);
        var value = property.values.find(function (value) {
          return value.categoryId === categoryId;
        });
        return value;
      } // public accessors

    }, {
      key: "subjects",
      get: function get() {
        return _classPrivateFieldGet(this, _subjects);
      }
    }, {
      key: "properties",
      get: function get() {
        return _classPrivateFieldGet(this, _properties);
      }
    }]);

    return Records;
  }();

  var Records$1 = new Records();

  var CONF_PROPERTIES = 'https://raw.githubusercontent.com/dbcls/togosite/develop/config/togosite-human/properties.json';
  var CONF_TEMPLATES = 'https://raw.githubusercontent.com/dbcls/togosite/develop/config/togosite-human/templates.json';

  var _templates = new WeakMap();

  var _drawStanzas = new WeakSet();

  var _stanza = new WeakSet();

  var ReportApp = /*#__PURE__*/function () {
    function ReportApp() {
      _classCallCheck(this, ReportApp);

      _stanza.add(this);

      _drawStanzas.add(this);

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

        Promise.all([fetch(CONF_PROPERTIES), fetch(CONF_TEMPLATES)]).then(function (responces) {
          return Promise.all(responces.map(function (responce) {
            return responce.json();
          }));
        }).then(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              subjects = _ref2[0],
              templates = _ref2[1];

          stanzaTtemplates = templates;
          Records$1.setSubjects(subjects); // set stanza scripts

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
          _classPrivateFieldSet(_this, _templates, Object.fromEntries(Object.keys(stanzaTtemplates.templates).map(function (stanza, index) {
            return [stanza, templates[index]];
          })));

          _classPrivateMethodGet(_this, _drawStanzas, _drawStanzas2).call(_this);
        });
      }
    }, {
      key: "getHslColor",
      value: // utilities
      function getHslColor(hue) {
        return "hsl(".concat(hue, ", 50%, 55%)");
      }
    }]);

    return ReportApp;
  }();

  function _drawStanzas2() {
    var _this2 = this;

    var urlVars = Object.fromEntries(window.location.search.substr(1).split('&').map(function (keyValue) {
      return keyValue.split('=');
    }));
    var properties = JSON.parse(decodeURIComponent(urlVars.properties));
    var main = document.querySelector('main');
    var subjectId = Records$1.subjects.find(function (subject) {
      return subject.togoKey === urlVars.togoKey;
    }).subjectId;
    main.innerHTML = _classPrivateMethodGet(this, _stanza, _stanza2).call(this, subjectId, urlVars.id, urlVars.togoKey) + properties.map(function (property) {
      if (property === undefined) {
        return '';
      } else {
        var subject = Records$1.subjects.find(function (subject) {
          return subject.properties.some(function (subjectProperty) {
            return subjectProperty.propertyId === property.propertyId;
          });
        });
        var property2 = subject.properties.find(function (property) {
          return property.propertyId === property.propertyId;
        });
        return "<hr>\n          <div class=\"attributes\">\n            <header style=\"background-color: ".concat(_this2.getHslColor(subject.hue), ";\">").concat(property2.label, "</header>\n            ").concat(property.attributes.map(function (attribute) {
          return _classPrivateMethodGet(_this2, _stanza, _stanza2).call(_this2, subject.subjectId, attribute.id, property.propertyKey);
        }).join(''), "\n          </div>");
      }
    }).join('');
  }

  function _stanza2(subjectId, id, key) {
    return "<div class=\"stanza\">".concat(_classPrivateFieldGet(this, _templates)[subjectId].replace(/{{id}}/g, id).replace(/{{type}}/g, key), "</div>");
  }

  var ReportApp$1 = new ReportApp();

  globalThis.togositeapp = ReportApp$1;
  ReportApp$1.ready();

}());
//# sourceMappingURL=report.js.map
