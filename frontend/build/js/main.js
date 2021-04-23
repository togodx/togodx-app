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

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
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

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
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

  var DefaultEventEmitter = /*#__PURE__*/function (_EventTarget) {
    _inherits(DefaultEventEmitter, _EventTarget);

    var _super = _createSuper(DefaultEventEmitter);

    function DefaultEventEmitter() {
      _classCallCheck(this, DefaultEventEmitter);

      return _super.call(this);
    }

    return DefaultEventEmitter;
  }( /*#__PURE__*/_wrapNativeSuper(EventTarget));

  var DefaultEventEmitter$1 = new DefaultEventEmitter();

  var _propertyConditions = new WeakMap();

  var _attributeConditions = new WeakMap();

  var _subjectId = new WeakMap();

  var _togoKey = new WeakMap();

  var _satisfyAggregation = new WeakSet();

  var ConditionBuilder = /*#__PURE__*/function () {
    function ConditionBuilder() {
      _classCallCheck(this, ConditionBuilder);

      _satisfyAggregation.add(this);

      _propertyConditions.set(this, {
        writable: true,
        value: void 0
      });

      _attributeConditions.set(this, {
        writable: true,
        value: void 0
      });

      _subjectId.set(this, {
        writable: true,
        value: void 0
      });

      _togoKey.set(this, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(this, _propertyConditions, []);

      _classPrivateFieldSet(this, _attributeConditions, []);
    } // public methods


    _createClass(ConditionBuilder, [{
      key: "addProperty",
      value: function addProperty(condition) {
        console.log('addProperty', condition); // store

        _classPrivateFieldGet(this, _propertyConditions).push(condition); // evaluate


        _classPrivateMethodGet(this, _satisfyAggregation, _satisfyAggregation2).call(this); // dispatch event


        var event = new CustomEvent('mutatePropertyCondition', {
          detail: {
            action: 'add',
            condition: condition
          }
        });
        DefaultEventEmitter$1.dispatchEvent(event);
      }
    }, {
      key: "addPropertyValue",
      value: function addPropertyValue(condition) {
        console.log('add condition', condition); // store

        _classPrivateFieldGet(this, _attributeConditions).push(condition); // evaluate


        _classPrivateMethodGet(this, _satisfyAggregation, _satisfyAggregation2).call(this); // dispatch event


        var event = new CustomEvent('mutatePropertyValueCondition', {
          detail: {
            action: 'add',
            condition: condition
          }
        });
        DefaultEventEmitter$1.dispatchEvent(event);
      }
    }, {
      key: "removeProperty",
      value: function removeProperty(propertyId) {
        // remove from store
        var position = _classPrivateFieldGet(this, _propertyConditions).findIndex(function (condition) {
          return condition.property.propertyId === propertyId;
        });

        if (position === -1) return;
        _classPrivateFieldGet(this, _propertyConditions).splice(position, 1)[0]; // evaluate

        _classPrivateMethodGet(this, _satisfyAggregation, _satisfyAggregation2).call(this); // dispatch event


        var event = new CustomEvent('mutatePropertyCondition', {
          detail: {
            action: 'remove',
            propertyId: propertyId
          }
        });
        DefaultEventEmitter$1.dispatchEvent(event);
      }
    }, {
      key: "removePropertyValue",
      value: function removePropertyValue(propertyId, categoryId, range) {
        // remove from store
        var position = _classPrivateFieldGet(this, _attributeConditions).findIndex(function (condition) {
          return condition.property.propertyId === propertyId && condition.value.categoryId === categoryId;
        });

        if (position === -1) return;
        _classPrivateFieldGet(this, _attributeConditions).splice(position, 1)[0]; // evaluate

        _classPrivateMethodGet(this, _satisfyAggregation, _satisfyAggregation2).call(this); // dispatch event


        var event = new CustomEvent('mutatePropertyValueCondition', {
          detail: {
            action: 'remove',
            propertyId: propertyId,
            categoryId: categoryId
          }
        });
        DefaultEventEmitter$1.dispatchEvent(event);
      }
    }, {
      key: "makeQueryParameter",
      value: function makeQueryParameter() {
        var _this = this;

        // create properties
        var properties = _classPrivateFieldGet(this, _propertyConditions).map(function (condition) {
          return {
            query: {
              propertyId: condition.property.propertyId
            },
            property: condition.property,
            subject: condition.subject
          };
        });

        var attributesForEachProperties = {};

        _classPrivateFieldGet(this, _attributeConditions).forEach(function (condition) {
          var propertyId = condition.property.propertyId;
          if (!attributesForEachProperties[propertyId]) attributesForEachProperties[propertyId] = [];
          attributesForEachProperties[propertyId].push(condition.value.categoryId);
        }); // create attributes (property values)


        var attributes = Object.keys(attributesForEachProperties).map(function (propertyId) {
          return {
            query: {
              propertyId: propertyId,
              categoryIds: attributesForEachProperties[propertyId]
            },
            property: _classPrivateFieldGet(_this, _attributeConditions).find(function (condition) {
              return condition.property.propertyId === propertyId;
            }).property,
            subject: _classPrivateFieldGet(_this, _attributeConditions).find(function (condition) {
              return condition.property.propertyId === propertyId;
            }).subject
          };
        }); // emmit event

        var event = new CustomEvent('completeQueryParameter', {
          detail: {
            togoKey: _classPrivateFieldGet(this, _togoKey),
            subjectId: _classPrivateFieldGet(this, _subjectId),
            properties: properties,
            attributes: attributes
          }
        });
        DefaultEventEmitter$1.dispatchEvent(event); // clear condition
        // this.#propertyConditions = [];
        // this.#attributeConditions = [];
      }
    }, {
      key: "setSubject",
      value: function setSubject(togoKey, subjectId) {
        _classPrivateFieldSet(this, _togoKey, togoKey);

        _classPrivateFieldSet(this, _subjectId, subjectId);

        _classPrivateMethodGet(this, _satisfyAggregation, _satisfyAggregation2).call(this);
      } // private methods

    }]);

    return ConditionBuilder;
  }();

  function _satisfyAggregation2() {
    var established = _classPrivateFieldGet(this, _togoKey) && _classPrivateFieldGet(this, _subjectId) && (_classPrivateFieldGet(this, _propertyConditions).length > 0 || _classPrivateFieldGet(this, _attributeConditions).length > 0);
    var event = new CustomEvent('mutateEstablishConditions', {
      detail: established
    });
    DefaultEventEmitter$1.dispatchEvent(event);
  }

  var ConditionBuilder$1 = new ConditionBuilder();

  var _select = new WeakMap();

  var _propertiesConditionsContainer = new WeakMap();

  var _attributesConditionsContainer = new WeakMap();

  var _execButton = new WeakMap();

  var _addProperty = new WeakSet();

  var _removeProperty = new WeakSet();

  var _addPropertyValue = new WeakSet();

  var _removePropertyValue = new WeakSet();

  var ConditionBuilderView = /*#__PURE__*/function () {
    function ConditionBuilderView(elm) {
      var _this = this;

      _classCallCheck(this, ConditionBuilderView);

      _removePropertyValue.add(this);

      _addPropertyValue.add(this);

      _removeProperty.add(this);

      _addProperty.add(this);

      _select.set(this, {
        writable: true,
        value: void 0
      });

      _propertiesConditionsContainer.set(this, {
        writable: true,
        value: void 0
      });

      _attributesConditionsContainer.set(this, {
        writable: true,
        value: void 0
      });

      _execButton.set(this, {
        writable: true,
        value: void 0
      });

      // references
      var body = document.querySelector('body');

      _classPrivateFieldSet(this, _select, elm.querySelector(':scope > select'));

      var conditionsContainer = elm.querySelector(':scope > .conditions');

      _classPrivateFieldSet(this, _propertiesConditionsContainer, conditionsContainer.querySelector(':scope > .properties > .conditions'));

      _classPrivateFieldSet(this, _attributesConditionsContainer, conditionsContainer.querySelector(':scope > .attributes > .conditions'));

      _classPrivateFieldSet(this, _execButton, elm.querySelector(':scope > footer > button.exec')); // attach event


      _classPrivateFieldGet(this, _execButton).addEventListener('click', function () {
        // this.#propertiesConditionsContainer.innerHTML = '';
        // this.#attributesConditionsContainer.innerHTML = '';
        body.dataset.display = 'results';
        ConditionBuilder$1.makeQueryParameter();
      }); // event listeners


      DefaultEventEmitter$1.addEventListener('mutatePropertyCondition', function (e) {
        switch (e.detail.action) {
          case 'add':
            _classPrivateMethodGet(_this, _addProperty, _addProperty2).call(_this, e.detail.condition.subject, e.detail.condition.property);

            break;

          case 'remove':
            _classPrivateMethodGet(_this, _removeProperty, _removeProperty2).call(_this, e.detail.propertyId);

            break;
        }
      });
      DefaultEventEmitter$1.addEventListener('mutatePropertyValueCondition', function (e) {
        switch (e.detail.action) {
          case 'add':
            _classPrivateMethodGet(_this, _addPropertyValue, _addPropertyValue2).call(_this, e.detail.condition.subject, e.detail.condition.property, e.detail.condition.value);

            break;

          case 'remove':
            _classPrivateMethodGet(_this, _removePropertyValue, _removePropertyValue2).call(_this, e.detail.propertyId, e.detail.categoryId);

            break;
        }
      });
      DefaultEventEmitter$1.addEventListener('mutateEstablishConditions', function (e) {
        _classPrivateFieldGet(_this, _execButton).disabled = !e.detail;
      });
    } // public methods


    _createClass(ConditionBuilderView, [{
      key: "defineTogoKeys",
      value: function defineTogoKeys(togoKeys) {
        // make options
        _classPrivateFieldGet(this, _select).insertAdjacentHTML('beforeend', togoKeys.map(function (togoKey) {
          return "<option value=\"".concat(togoKey.togoKey, "\" data-subject-id=\"").concat(togoKeys.subjectId, "\">").concat(togoKey.label, " (").concat(togoKey.togoKey, ")</option>");
        }).join(''));

        _classPrivateFieldGet(this, _select).disabled = false; // attach event

        _classPrivateFieldGet(this, _select).addEventListener('change', function (e) {
          var togoKey = togoKeys.find(function (togoKey) {
            return togoKey.togoKey === e.target.value;
          });
          ConditionBuilder$1.setSubject(e.target.value, togoKey.subjectId);
        });
      } // private methods

    }]);

    return ConditionBuilderView;
  }();

  function _addProperty2(subject, property) {
    // make view
    var view = document.createElement('div');
    view.classList.add('stacking-condition-view');
    view.dataset.propertyId = property.propertyId;
    view.innerHTML = "\n    <div class=\"closebutton\"></div>\n    <ul class=\"path\">\n      <li>".concat(subject.subject, "</li>\n    </ul>\n    <div class=\"label\" style=\"color: ").concat(App$1.getHslColor(subject.hue), ";\">").concat(property.label, "</div>");

    _classPrivateFieldGet(this, _propertiesConditionsContainer).insertAdjacentElement('beforeend', view); // event


    view.querySelector(':scope > .closebutton').addEventListener('click', function () {
      ConditionBuilder$1.removeProperty(view.dataset.propertyId);
    });
  }

  function _removeProperty2(propertyId) {
    var view = _classPrivateFieldGet(this, _propertiesConditionsContainer).querySelector("[data-property-id=\"".concat(propertyId, "\"]"));

    view.parentNode.removeChild(view);
  }

  function _addPropertyValue2(subject, property, value) {
    // make view
    var view = document.createElement('div');
    view.classList.add('stacking-condition-view');
    view.classList.add('-value');
    view.dataset.propertyId = property.propertyId;
    view.dataset.categoryId = value.categoryId; // view.dataset.range = [0, 0]; // TODO:

    view.style.backgroundColor = "hsl(".concat(subject.hue, ", 45%, 50%)");
    view.innerHTML = "\n    <div class=\"closebutton\"></div>\n    <ul class=\"path\">\n      <li>".concat(subject.subject, "</li>\n      <li>").concat(property.label, "</li>\n      ").concat(value.ancestors.map(function (ancestor) {
      return "<li>".concat(ancestor, "</li>");
    }).join(''), "\n    </ul>\n    <div class=\"label\">").concat(value.label, "</div>");

    _classPrivateFieldGet(this, _attributesConditionsContainer).insertAdjacentElement('beforeend', view); // event


    view.querySelector(':scope > .closebutton').addEventListener('click', function () {
      ConditionBuilder$1.removePropertyValue(view.dataset.propertyId, view.dataset.categoryId);
    });
  }

  function _removePropertyValue2(propertyId, categoryId) {
    var view = _classPrivateFieldGet(this, _attributesConditionsContainer).querySelector("[data-property-id=\"".concat(propertyId, "\"][data-category-id=\"").concat(categoryId, "\"]"));

    view.parentNode.removeChild(view);
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
        var property = _classPrivateFieldGet(this, _properties).find(function (property) {
          return property.propertyId === propertyId;
        });

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
    }]);

    return Records;
  }();

  var Records$1 = new Records();

  var _templates = new WeakMap();

  var _BODY = new WeakMap();

  var _STANZAS_CONTAINER = new WeakMap();

  var _showStanza = new WeakSet();

  var _hideStanza = new WeakSet();

  var _stanza = new WeakSet();

  var ReportsView = /*#__PURE__*/function () {
    function ReportsView(elm) {
      var _this = this;

      _classCallCheck(this, ReportsView);

      _stanza.add(this);

      _hideStanza.add(this);

      _showStanza.add(this);

      _templates.set(this, {
        writable: true,
        value: void 0
      });

      _BODY.set(this, {
        writable: true,
        value: void 0
      });

      _STANZAS_CONTAINER.set(this, {
        writable: true,
        value: void 0
      });

      this._stanzas = {}; // references

      _classPrivateFieldSet(this, _BODY, document.querySelector('body'));

      _classPrivateFieldSet(this, _STANZAS_CONTAINER, elm.querySelector(':scope > .stanzas'));

      var returnButton = elm.querySelector(':scope > footer > button.return'); // attach event

      returnButton.addEventListener('click', function () {
        _classPrivateFieldGet(_this, _BODY).dataset.display = 'properties';
      }); // event listener

      DefaultEventEmitter$1.addEventListener('showStanza', function (e) {
        _classPrivateMethodGet(_this, _showStanza, _showStanza2).call(_this, e.detail.subject, e.detail.properties);
      });
      DefaultEventEmitter$1.addEventListener('hideStanza', function (e) {
        _classPrivateMethodGet(_this, _hideStanza, _hideStanza2).call(_this);
      });
    } // private methods


    _createClass(ReportsView, [{
      key: "defineTemplates",
      value: // public methods
      function defineTemplates(templates) {
        console.log(templates);

        _classPrivateFieldSet(this, _templates, templates);
      }
    }]);

    return ReportsView;
  }();

  function _showStanza2(subject, properties) {
    var _this2 = this;

    console.log(subject, properties); // make stanzas

    _classPrivateFieldGet(this, _STANZAS_CONTAINER).innerHTML = _classPrivateMethodGet(this, _stanza, _stanza2).call(this, subject.id, subject.value) + properties.map(function (property) {
      if (property === undefined) {
        return '';
      } else {
        var _subject = Records$1.subjects.find(function (subject) {
          return subject.properties.some(function (subjectProperty) {
            return subjectProperty.propertyId === property.propertyId;
          });
        }); // TODO: 1個目のアトリビュートしか返していない


        return _classPrivateMethodGet(_this2, _stanza, _stanza2).call(_this2, _subject.subjectId, property.attributes[0].id);
      }
    }).join('');
  }

  function _hideStanza2() {
    _classPrivateFieldGet(this, _STANZAS_CONTAINER).innerHTML = '';
  }

  function _stanza2(subjectId, value) {
    return "<div class=\"stanza-view\">".concat(_classPrivateFieldGet(this, _templates)[subjectId].replace(/{{id}}/g, value), "</div>");
  }

  function collapseView(elm) {
    var button = elm.querySelector(".collapsebutton[data-collapse=\"".concat(elm.dataset.collapse, "\"]"));
    var content = elm.querySelector(".collapsingcontent[data-collapse=\"".concat(elm.dataset.collapse, "\"]"));
    button.addEventListener('click', function () {
      elm.classList.toggle('-spread');
      button.classList.toggle('-spread');
      content.classList.toggle('-spread');
    });
  }

  var ColumnSelectorView = /*#__PURE__*/function () {
    function ColumnSelectorView(elm, subject, property, items, sparqlist) {
      var _this = this;

      _classCallCheck(this, ColumnSelectorView);

      this._subject = subject;
      this._property = property;
      this._sparqlist = sparqlist;
      this._itemStatus = {};
      this._columns = []; // make container

      elm.innerHTML = "\n    <div class=\"column-selector-view\">\n      <div class=\"columns\">\n        <div class=\"inner\"></div>\n      </div>\n      <div class=\"loading-view\"></div>\n    </div>";
      this._view = elm.querySelector(':scope > .column-selector-view');
      this._container = this._view.querySelector(':scope > .columns > .inner');
      this._loadingView = this._view.querySelector(':scope > .loading-view'); // even listener

      DefaultEventEmitter$1.addEventListener('mutatePropertyValueCondition', function (e) {
        var propertyId, categoryId;

        switch (e.detail.action) {
          case 'add':
            propertyId = e.detail.condition.property.propertyId;
            categoryId = e.detail.condition.value.categoryId;
            break;

          case 'remove':
            propertyId = e.detail.propertyId;
            categoryId = e.detail.categoryId;
            break;
        }

        if (_this._property.propertyId == propertyId) {
          // TODO: Number型になればこの処理は厳密比較に
          _this._columns.forEach(function (ul) {
            ul.querySelectorAll('li').forEach(function (li) {
              if (li.dataset.id == categoryId) {
                // TODO: Number型になればこの処理は厳密比較に
                var isChecked = e.detail.action === 'add';
                li.querySelector(':scope > input[type="checkbox"]').checked = isChecked;
                _this._itemStatus[li.dataset.id].checked = isChecked;
              }
            });
          });
        }
      });

      this._addItems(items, 0);

      this._makeColumn(items, 0);
    }

    _createClass(ColumnSelectorView, [{
      key: "_addItems",
      value: function _addItems(items, depth, parent) {
        // console.log(items, depth)
        var _iterator = _createForOfIteratorHelper(items),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;
            var hasChild = item.hasChild && item.hasChild === true;
            this._itemStatus[item.categoryId] = {
              label: item.label,
              parent: parent,
              hasChild: hasChild ? true : false,
              depth: depth,
              selected: false,
              checked: false
            };

            if (hasChild) {
              this._itemStatus[item.categoryId].children = [];
            }
          } // console.log(this._itemStatus)

        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }, {
      key: "_makeColumn",
      value: function _makeColumn(items, depth) {
        var _this2 = this;

        // console.log(items)
        this._items = items.map(function (item) {
          return Object.assign({}, item);
        }); // get column element

        var ul;

        if (this._columns[depth]) {
          ul = this._columns[depth];
        } else {
          ul = document.createElement('ul');
          ul.classList.add('column');
          this._columns[depth] = ul;
        } // make items


        ul.innerHTML = this._items.map(function (item) {
          return "<li class=\"item".concat(item.hasChild ? ' -haschild' : '', "\" data-id=\"").concat(item.categoryId, "\">\n        <input type=\"checkbox\" value=\"").concat(item.categoryId, "\"/>\n        <span class=\"label\">").concat(item.label, "</span>\n        <span class=\"count\">").concat(item.count.toLocaleString(), "</span>\n      </li>");
        }).join('');

        this._container.insertAdjacentElement('beforeend', ul);

        ul.querySelectorAll(':scope > .item').forEach(function (item, index) {
          _this2._items[index].elm = item;
        });

        this._update(App$1.viewModes.log10); // drill down event


        ul.querySelectorAll(':scope > .item.-haschild').forEach(function (item) {
          item.addEventListener('click', function () {
            item.classList.add('-selected'); // delete an existing lower columns

            if (_this2._columns.length > depth + 1) {
              for (var i = depth + 1; i < _this2._columns.length; i++) {
                if (_this2._columns[i].parentNode) _this2._container.removeChild(_this2._columns[i]);
              }
            } // deselect siblings


            var selectedItemKeys = Object.keys(_this2._itemStatus).filter(function (id) {
              return _this2._itemStatus[id].selected && _this2._itemStatus[id].depth >= depth;
            });

            var _iterator2 = _createForOfIteratorHelper(selectedItemKeys),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var key = _step2.value;
                _this2._itemStatus[key].selected = false;

                var selectedItem = _this2._columns[depth].querySelector("[data-id=\"".concat(key, "\"]"));

                if (selectedItem) selectedItem.classList.remove('-selected');
              } // get lower column

            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            _this2._itemStatus[item.dataset.id].selected = true;

            _this2._getChildren(item.dataset.id, depth + 1);
          });
        }); // select/deselect a item (attribute)

        ul.querySelectorAll(':scope > .item > input[type="checkbox"]').forEach(function (checkbox) {
          checkbox.addEventListener('click', function (e) {
            e.stopPropagation();

            if (checkbox.checked) {
              // add
              var ancestors = [];
              var id = checkbox.value;
              var parent;

              do {
                parent = _this2._itemStatus[id].parent;
                if (parent) ancestors.unshift(_this2._itemStatus[parent]);
                id = parent;
              } while (parent);

              ConditionBuilder$1.addPropertyValue({
                subject: _this2._subject,
                property: _this2._property,
                value: {
                  categoryId: checkbox.value,
                  label: _this2._itemStatus[checkbox.value].label,
                  ancestors: ancestors.map(function (ancestor) {
                    return ancestor.label;
                  })
                }
              });
            } else {
              // remove
              ConditionBuilder$1.removePropertyValue(_this2._property.propertyId, checkbox.value);
            }
          });
        }); // event listener

        DefaultEventEmitter$1.addEventListener('changeViewModes', function (e) {
          return _this2._update(e.detail.log10);
        });
      }
    }, {
      key: "_update",
      value: function _update(isLog10) {
        var _this3 = this;

        var max = Math.max.apply(Math, _toConsumableArray(Array.from(this._items).map(function (item) {
          return item.count;
        })));
        max = isLog10 ? Math.log10(max) : max;

        this._items.forEach(function (item) {
          item.elm.style.backgroundColor = "hsl(".concat(_this3._subject.hue, ", 75%, ").concat(100 - (isLog10 ? Math.log10(item.count) : item.count) / max * 40, "%)");
        });
      }
    }, {
      key: "_getChildren",
      value: function _getChildren(id, depth) {
        var _this4 = this;

        // loading
        this._loadingView.classList.add('-shown');

        fetch(this._sparqlist + '?categoryIds=' + id).then(function (responce) {
          return responce.json();
        }).then(function (json) {
          _this4._addItems(json, depth, id);

          _this4._makeColumn(json, depth);

          _this4._loadingView.classList.remove('-shown'); // scroll


          var gap = _this4._view.scrollWidth - _this4._view.clientWidth;
          if (gap > 0) _this4._view.scrollLeft = gap;
        });
      }
    }]);

    return ColumnSelectorView;
  }();

  var HistogramRangeSelectorView = /*#__PURE__*/function () {
    function HistogramRangeSelectorView(elm, subject, property, items, sparqlist) {
      var _this = this;

      _classCallCheck(this, HistogramRangeSelectorView);

      // console.log(elm, subject, property, items, sparqlist)
      this._subject = subject;
      this._property = property;
      this._sparqlist = sparqlist;
      this._items = items.map(function (item) {
        return Object.assign({}, item);
      }); // make container

      elm.innerHTML = "\n    <div class=\"histogram-range-selector-view\">\n      <div class=\"histogram\">\n        <div class=\"grid\"></div>\n        <div class=\"graph\"></div>\n      </div>\n      <div class=\"controller\">\n        <div class=\"selector\">\n          <div class=\"slider -min\"></div>\n          <div class=\"slider -max\"></div>\n        </div>\n        <div class=\"form\">\n          <input type=\"number\" data-range=\"min\">\n          ~\n          <input type=\"number\" data-range=\"max\">\n        </div>\n      </div>"; // make graph

      var width = 100 / this._items.length;
      elm.querySelector('.graph').innerHTML = this._items.map(function (item, index) {
        return "<div class=\"bar\" style=\"width: ".concat(width, "%; background-color: ").concat(App$1.getHslColor(subject.hue), ";\" data-count=\"").concat(item.count, "\">\n      <div class=\"color\" style=\"background-color: hsla(").concat(360 * index / _this._items.length, ", 70%, 50%, .075);\"></div>\n    </div>");
      }).join('');
      elm.querySelectorAll('.graph > .bar').forEach(function (item, index) {
        _this._items[index].elm = item;
      });

      this._update(); // event


      DefaultEventEmitter$1.addEventListener('changeViewModes', function (e) {
        return _this._update();
      });
    }

    _createClass(HistogramRangeSelectorView, [{
      key: "_update",
      value: function _update() {
        var isLog10 = App$1.viewModes.log10;
        var max = Math.max.apply(Math, _toConsumableArray(Array.from(this._items).map(function (item) {
          return item.count;
        })));
        max = isLog10 ? Math.log10(max) : max;

        this._items.forEach(function (item) {
          item.elm.style.height = (isLog10 ? Math.log10(item.count) : item.count) / max * 100 + '%';
        });
      }
    }]);

    return HistogramRangeSelectorView;
  }();

  var _subject$1 = new WeakMap();

  var _property$1 = new WeakMap();

  var _values = new WeakMap();

  var _update = new WeakSet();

  var TrackOverviewCategorical = function TrackOverviewCategorical(elm, subject, property, values) {
    var _this = this;

    _classCallCheck(this, TrackOverviewCategorical);

    _update.add(this);

    _subject$1.set(this, {
      writable: true,
      value: void 0
    });

    _property$1.set(this, {
      writable: true,
      value: void 0
    });

    _values.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _subject$1, subject);

    _classPrivateFieldSet(this, _property$1, property);

    _classPrivateFieldSet(this, _values, values.map(function (value) {
      return Object.assign({}, value);
    })); // make overview
    // TODO: ヒストグラムは別処理


    var _sum = values.reduce(function (acc, value) {
      return acc + value.count;
    }, 0);

    var _width = 100 / values.length;

    elm.innerHTML = _classPrivateFieldGet(this, _values).map(function (value, index) {
      value.countLog10 = value.count === 0 ? 0 : Math.log10(value.count);
      value.width = value.count / _sum * 100;
      return "\n        <li class=\"value\" style=\"width: ".concat(_width, "%;\" data-category-id=\"").concat(value.categoryId, "\">\n          <div class=\"color\" style=\"background-color: hsla(").concat(360 * index / values.length, ", 70%, 50%, .075);\"></div>\n          <div class=\"heatmap\"></div>\n          <p>\n            <span class=\"label\">").concat(value.label, "</span>\n            <span class=\"count\">").concat(value.count.toLocaleString(), "</span>\n          </p>\n        </li>");
    }).join('');
    elm.querySelectorAll(':scope > .value').forEach(function (node, index) {
      return _classPrivateFieldGet(_this, _values)[index].elm = node;
    });

    _classPrivateMethodGet(this, _update, _update2).call(this, App$1.viewModes); // attach event


    elm.querySelectorAll(':scope > .value').forEach(function (valueElm) {
      // show tooltip
      valueElm.addEventListener('mouseenter', function () {
        var valueData = _classPrivateFieldGet(_this, _values).find(function (valueData) {
          return valueData.elm === valueElm;
        });

        var event = new CustomEvent('enterPropertyValueItemView', {
          detail: {
            label: "<span style=\"color: ".concat(App$1.getHslColor(_classPrivateFieldGet(_this, _subject$1).hue), "\">").concat(valueElm.querySelector(':scope > p > .label').textContent, "</span>"),
            values: [{
              key: 'Count',
              value: valueData.count.toLocaleString()
            }],
            elm: valueElm
          }
        });
        DefaultEventEmitter$1.dispatchEvent(event);
      });
      valueElm.addEventListener('mouseleave', function () {
        var event = new CustomEvent('leavePropertyValueItemView');
        DefaultEventEmitter$1.dispatchEvent(event);
      }); // select/deselect a value

      valueElm.addEventListener('click', function () {
        var valueData = _classPrivateFieldGet(_this, _values).find(function (valueData) {
          return valueData.categoryId === valueElm.dataset.categoryId;
        });

        if (valueElm.classList.contains('-selected')) {
          valueElm.classList.remove('-selected');
          ConditionBuilder$1.removePropertyValue(_classPrivateFieldGet(_this, _property$1).propertyId, valueData.categoryId);
        } else {
          valueElm.classList.add('-selected');
          ConditionBuilder$1.addPropertyValue({
            subject: _classPrivateFieldGet(_this, _subject$1),
            property: _classPrivateFieldGet(_this, _property$1),
            value: {
              categoryId: valueData.categoryId,
              label: valueData.label,
              count: valueData.count,
              ancestors: []
            }
          });
        }
      });
    }); // event listener

    DefaultEventEmitter$1.addEventListener('mutatePropertyValueCondition', function (e) {
      var propertyId, categoryId;

      switch (e.detail.action) {
        case 'add':
          propertyId = e.detail.condition.property.propertyId;
          categoryId = e.detail.condition.value.categoryId;
          break;

        case 'remove':
          propertyId = e.detail.propertyId;
          categoryId = e.detail.categoryId;
          break;
      }

      if (_classPrivateFieldGet(_this, _property$1).propertyId === propertyId) {
        _classPrivateFieldGet(_this, _values).forEach(function (value) {
          if (value.categoryId === categoryId) {
            switch (e.detail.action) {
              case 'add':
                value.elm.classList.add('-selected');
                break;

              case 'remove':
                value.elm.classList.remove('-selected');
                break;
            }
          }
        });
      }
    });
    DefaultEventEmitter$1.addEventListener('changeViewModes', function (e) {
      return _classPrivateMethodGet(_this, _update, _update2).call(_this, e.detail);
    });
  };

  function _update2(viewModes) {
    var isArea = viewModes.area;
    var isLog10 = viewModes.log10;

    var sum = _classPrivateFieldGet(this, _values).reduce(function (acc, value) {
      return acc + (isLog10 ? value.countLog10 : value.count);
    }, 0);

    var max = Math.max.apply(Math, _toConsumableArray(_classPrivateFieldGet(this, _values).map(function (value) {
      return value.count;
    })));
    max = isLog10 ? Math.log10(max) : max;
    var fixedWidth = isArea ? 0 : 100 / _classPrivateFieldGet(this, _values).length;
    var width;
    var left = 0;

    _classPrivateFieldGet(this, _values).forEach(function (value) {
      width = isArea ? (isLog10 ? Math.log10(value.count) : value.count) / sum * 100 : fixedWidth;
      value.elm.style.width = width + '%';
      value.elm.style.left = left + '%';
      value.elm.querySelector(':scope > .heatmap').style.backgroundColor = "rgba(51, 50, 48, ".concat(1 - (isLog10 ? value.countLog10 : value.count) / max, ")");
      left += width;
    });
  }

  var _subject = new WeakMap();

  var _property = new WeakMap();

  var _sparqlist = new WeakMap();

  var _ROOT$3 = new WeakMap();

  var _LOADING_VIEW$1 = new WeakMap();

  var _SELECT_CONTAINER = new WeakMap();

  var _OVERVIEW_CONTAINER = new WeakMap();

  var _CHECKBOX_ALL_PROPERTIES = new WeakMap();

  var _makeValues = new WeakSet();

  var TrackView = function TrackView(subject, property, container, positionRate) {
    var _this = this;

    _classCallCheck(this, TrackView);

    _makeValues.add(this);

    _subject.set(this, {
      writable: true,
      value: void 0
    });

    _property.set(this, {
      writable: true,
      value: void 0
    });

    _sparqlist.set(this, {
      writable: true,
      value: void 0
    });

    _ROOT$3.set(this, {
      writable: true,
      value: void 0
    });

    _LOADING_VIEW$1.set(this, {
      writable: true,
      value: void 0
    });

    _SELECT_CONTAINER.set(this, {
      writable: true,
      value: void 0
    });

    _OVERVIEW_CONTAINER.set(this, {
      writable: true,
      value: void 0
    });

    _CHECKBOX_ALL_PROPERTIES.set(this, {
      writable: true,
      value: void 0
    });

    // console.log(subject, property, container)
    var elm = document.createElement('div');
    container.insertAdjacentElement('beforeend', elm);

    _classPrivateFieldSet(this, _ROOT$3, elm);

    _classPrivateFieldSet(this, _subject, subject);

    _classPrivateFieldSet(this, _property, property);

    _classPrivateFieldSet(this, _sparqlist, property.data);

    elm.classList.add('track-view');
    elm.classList.add('-preparing');
    elm.classList.add('collapse-view');
    elm.dataset.propertyId = property.propertyId;
    elm.dataset.collapse = property.propertyId; // make html

    elm.innerHTML = "\n    <div class=\"row -upper\">\n      <div class=\"left definition\">\n        <div class=\"collapsebutton\" data-collapse=\"".concat(property.propertyId, "\">\n          <h2 class=\"title\">").concat(property.label, "</h2>\n        </div>\n      </div>\n      <div class=\"right values\">\n        <div class=\"overview\" style=\"background-color: ").concat(App$1.getHslColor(subject.hue), ";\">\n          <ul class=\"inner\"></ul>\n          <div class=\"loading-view -shown\"></div>\n        </div>\n      </div>\n    </div>\n    <div class=\"row -lower collapsingcontent\" data-collapse=\"").concat(property.propertyId, "\">\n      <div class=\"left\">\n        <p class=\"description\">").concat(property.description, "</p>\n        <label><input type=\"checkbox\">All properties</label>\n      </div>\n      <div class=\"right selector\"></div>\n    </div>");
    var valuesContainer = elm.querySelector(':scope > .row.-upper > .values');

    _classPrivateFieldSet(this, _OVERVIEW_CONTAINER, valuesContainer.querySelector(':scope > .overview > .inner'));

    _classPrivateFieldSet(this, _LOADING_VIEW$1, valuesContainer.querySelector(':scope > .overview > .loading-view'));

    _classPrivateFieldSet(this, _SELECT_CONTAINER, elm.querySelector(':scope > .row.-lower > .selector')); // collapse


    collapseView(elm); // select/deselect a property

    _classPrivateFieldSet(this, _CHECKBOX_ALL_PROPERTIES, elm.querySelector(':scope > .row.-lower > .left > label > input'));

    _classPrivateFieldGet(this, _CHECKBOX_ALL_PROPERTIES).addEventListener('change', function (e) {
      e.stopPropagation();

      if (_classPrivateFieldGet(_this, _CHECKBOX_ALL_PROPERTIES).checked) {
        // add
        ConditionBuilder$1.addProperty({
          subject: _classPrivateFieldGet(_this, _subject),
          property: _classPrivateFieldGet(_this, _property)
        });

        _classPrivateFieldGet(_this, _ROOT$3).classList.add('-allselected');
      } else {
        // remove
        ConditionBuilder$1.removeProperty(_classPrivateFieldGet(_this, _property).propertyId);

        _classPrivateFieldGet(_this, _ROOT$3).classList.remove('-allselected');
      }
    }); // event listener


    DefaultEventEmitter$1.addEventListener('mutatePropertyCondition', function (e) {
      if (e.detail.action === 'remove') {
        if (e.detail.propertyId === _classPrivateFieldGet(_this, _property).propertyId) {
          _classPrivateFieldGet(_this, _CHECKBOX_ALL_PROPERTIES).checked = false;
        }
      }
    }); // get property data

    fetch(property.data).then(function (responce) {
      return responce.json();
    }).then(function (json) {
      return _classPrivateMethodGet(_this, _makeValues, _makeValues2).call(_this, json);
    }).catch(function (error) {
      console.error(error);

      _classPrivateFieldGet(_this, _OVERVIEW_CONTAINER).insertAdjacentHTML('afterend', "<div class=\"error\">".concat(error, " - <a href=\"").concat(property.data, "\" target=\"_blank\">").concat(property.data, "</a></div>"));

      _classPrivateFieldGet(_this, _LOADING_VIEW$1).classList.remove('-shown');
    });
  } // private methods
  ;

  function _makeValues2(values) {
    _classPrivateFieldGet(this, _ROOT$3).classList.remove('-preparing');

    _classPrivateFieldGet(this, _LOADING_VIEW$1).classList.remove('-shown');

    Records$1.setValues(_classPrivateFieldGet(this, _property).propertyId, values); // make overview

    new TrackOverviewCategorical(_classPrivateFieldGet(this, _OVERVIEW_CONTAINER), _classPrivateFieldGet(this, _subject), _classPrivateFieldGet(this, _property), values); // make selector view

    if (_classPrivateFieldGet(this, _property).viewMethod && _classPrivateFieldGet(this, _property).viewMethod === 'histogram') {
      new HistogramRangeSelectorView(_classPrivateFieldGet(this, _SELECT_CONTAINER), _classPrivateFieldGet(this, _subject), _classPrivateFieldGet(this, _property), values, _classPrivateFieldGet(this, _sparqlist));
    } else {
      new ColumnSelectorView(_classPrivateFieldGet(this, _SELECT_CONTAINER), _classPrivateFieldGet(this, _subject), _classPrivateFieldGet(this, _property), values, _classPrivateFieldGet(this, _sparqlist));
    }
  }

  var ConceptView = function ConceptView(subject, elm) {
    _classCallCheck(this, ConceptView);

    elm.classList.add('concept-view');
    elm.innerHTML = "\n    <h3 class=\"title\" style=\"background-color: ".concat(App$1.getHslColor(subject.hue), ";\">\n      <span>").concat(subject.subject, "</span>\n    </h3>\n    <div class=\"properties\"></div>"); // make tracks

    var properties = subject.properties;
    var propertiesContainer = elm.querySelector(':scope > .properties');

    for (var i = 0; i < properties.length; i++) {
      var property = properties[i];
      new TrackView(subject, property, propertiesContainer, i / properties.length);
    }
  };

  var _propertyId = new WeakMap();

  var _hue = new WeakMap();

  var _COUNTS = new WeakMap();

  var _RATES = new WeakMap();

  var _TICKS = new WeakMap();

  var _draw = new WeakSet();

  var StatisticsView = function StatisticsView(elm, _property) {
    var _this = this;

    _classCallCheck(this, StatisticsView);

    _draw.add(this);

    _propertyId.set(this, {
      writable: true,
      value: void 0
    });

    _hue.set(this, {
      writable: true,
      value: void 0
    });

    _COUNTS.set(this, {
      writable: true,
      value: void 0
    });

    _RATES.set(this, {
      writable: true,
      value: void 0
    });

    _TICKS.set(this, {
      writable: true,
      value: void 0
    });

    console.log(_property);

    _classPrivateFieldSet(this, _propertyId, _property.property.propertyId);

    _classPrivateFieldSet(this, _hue, App$1.getHslColor(_property.subject.hue));

    elm.classList.add('statistics-view'); // make HTML

    elm.innerHTML = "<div class=\"statistics\">\n      <div class=\"counts\"></div>\n      <div class=\"rates\"></div>\n      <div class=\"ticks\"></div>\n    </div>"; // references

    var container = elm.querySelector(':scope > .statistics');

    _classPrivateFieldSet(this, _COUNTS, container.querySelector(':scope > .counts'));

    _classPrivateFieldSet(this, _RATES, container.querySelector(':scope > .rates'));

    _classPrivateFieldSet(this, _TICKS, container.querySelector(':scope > .ticks')); // event listener


    DefaultEventEmitter$1.addEventListener('addNextRows', function (e) {
      return _classPrivateMethodGet(_this, _draw, _draw2).call(_this, e.detail);
    });
  }
  /**
   * @param {TableData} detail.tableData
   * @param {Array} detail.rows
   * @param {Boolean} detail.done
   */
  ;

  function _draw2(detail) {
    var _this2 = this;

    // const data = detail.tableData.data;
    var attributes = detail.tableData.data.map(function (datum) {
      return datum.properties.find(function (property) {
        return property.propertyId === _classPrivateFieldGet(_this2, _propertyId);
      });
    }).filter(function (property) {
      return property !== undefined;
    }).map(function (property) {
      return property.attributes;
    }).flat().map(function (property) {
      return property.attribute;
    });

    var categoryIds = _toConsumableArray(new Set(attributes.map(function (attribute) {
      return attribute.categoryId;
    }))); // count


    var counts = categoryIds.map(function (categoryId) {
      return attributes.filter(function (attribute) {
        return attribute.categoryId === categoryId;
      }).length;
    });
    var countMax = Math.max.apply(Math, _toConsumableArray(counts)); // draw

    _classPrivateFieldGet(this, _COUNTS).innerHTML = counts.map(function (count) {
      var position = count / countMax < .5 ? ' -below' : '';
      return "\n      <div class=\"bar\" style=\"height: ".concat(count / countMax * 100, "%; background-color: ").concat(_classPrivateFieldGet(_this2, _hue), ";\">\n        <div class=\"value").concat(position, "\">").concat(count.toLocaleString(), "</div>\n      </div>");
    }).join(''); // rate

    var rates = categoryIds.map(function (categoryId, index) {
      var value = Records$1.getValue(_classPrivateFieldGet(_this2, _propertyId), categoryId);
      var sum = value.count * detail.tableData.rateOfProgress;
      return counts[index] / sum;
    });
    var rateMax = Math.max.apply(Math, _toConsumableArray(rates)); // draw

    _classPrivateFieldGet(this, _RATES).innerHTML = rates.map(function (rate) {
      var position = rate / rateMax < .5 ? ' -below' : '';
      return "\n      <div class=\"bar\" style=\"height: ".concat(rate / rateMax * 100, "%; background-color: ").concat(_classPrivateFieldGet(_this2, _hue), ";\">\n        <div class=\"value").concat(position, "\">").concat(rate.toLocaleString(), "</div>\n      </div>");
    }).join(''); // tick

    var labels = categoryIds.map(function (categoryId) {
      return attributes.find(function (attribute) {
        return attribute.categoryId === categoryId;
      });
    }).map(function (attribute) {
      return attribute.label;
    });
    _classPrivateFieldGet(this, _TICKS).innerHTML = labels.map(function (label) {
      return "\n      <div class=\"bar\">\n        <div class=\"label\">".concat(label, "</div>\n      </div>");
    }).join('');
  }

  var _ROOT$2 = new WeakMap();

  var _THEAD = new WeakMap();

  var _STATS = new WeakMap();

  var _TBODY = new WeakMap();

  var _TABLE_END = new WeakMap();

  var _LOADING_VIEW = new WeakMap();

  var _intersctionObserver = new WeakMap();

  var _tableData$1 = new WeakMap();

  var _enterTableEnd = new WeakSet();

  var _setupTable = new WeakSet();

  var _addTableRows = new WeakSet();

  var _failed = new WeakSet();

  var ResultsTable = function ResultsTable(_elm) {
    var _this = this;

    _classCallCheck(this, ResultsTable);

    _failed.add(this);

    _addTableRows.add(this);

    _setupTable.add(this);

    _enterTableEnd.add(this);

    _ROOT$2.set(this, {
      writable: true,
      value: void 0
    });

    _THEAD.set(this, {
      writable: true,
      value: void 0
    });

    _STATS.set(this, {
      writable: true,
      value: void 0
    });

    _TBODY.set(this, {
      writable: true,
      value: void 0
    });

    _TABLE_END.set(this, {
      writable: true,
      value: void 0
    });

    _LOADING_VIEW.set(this, {
      writable: true,
      value: void 0
    });

    _intersctionObserver.set(this, {
      writable: true,
      value: void 0
    });

    _tableData$1.set(this, {
      writable: true,
      value: void 0
    });

    // references
    _classPrivateFieldSet(this, _ROOT$2, _elm);

    var TABLE = _elm.querySelector(':scope > .body > table');

    _classPrivateFieldSet(this, _THEAD, TABLE.querySelector(':scope > thead > tr.header'));

    _classPrivateFieldSet(this, _STATS, TABLE.querySelector(':scope > thead > tr.statistics'));

    _classPrivateFieldSet(this, _TBODY, TABLE.querySelector(':scope > tbody'));

    _classPrivateFieldSet(this, _TABLE_END, _elm.querySelector(':scope > .body > .tableend'));

    _classPrivateFieldSet(this, _LOADING_VIEW, _classPrivateFieldGet(this, _TABLE_END).querySelector(':scope > .loading-view')); // get next data automatically


    _classPrivateFieldSet(this, _intersctionObserver, new IntersectionObserver(function (entries) {
      var _iterator = _createForOfIteratorHelper(entries),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;

          if (entry.target === _classPrivateFieldGet(_this, _TABLE_END)) {
            if (entry.isIntersecting) {
              _classPrivateMethodGet(_this, _enterTableEnd, _enterTableEnd2).call(_this);
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    })); // event listener


    DefaultEventEmitter$1.addEventListener('selectTableData', function (e) {
      return _classPrivateMethodGet(_this, _setupTable, _setupTable2).call(_this, e.detail);
    });
    DefaultEventEmitter$1.addEventListener('addNextRows', function (e) {
      return _classPrivateMethodGet(_this, _addTableRows, _addTableRows2).call(_this, e.detail);
    });
    DefaultEventEmitter$1.addEventListener('failedFetchTableDataIds', function (e) {
      return _classPrivateMethodGet(_this, _failed, _failed2).call(_this, e.detail);
    }); // turnoff intersection observer after display transition

    var mutationObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-display') {
          if (mutation.target.dataset.display !== 'results') {
            _classPrivateFieldGet(_this, _intersctionObserver).unobserve(_classPrivateFieldGet(_this, _TABLE_END)); // deselect table data


            _classPrivateFieldGet(_this, _tableData$1).deselect();
          }
        }
      });
    });
    mutationObserver.observe(document.querySelector('body'), {
      attributes: true
    });
  } // private methods
  ;

  function _enterTableEnd2() {
    _classPrivateFieldGet(this, _intersctionObserver).unobserve(_classPrivateFieldGet(this, _TABLE_END));

    _classPrivateFieldGet(this, _tableData$1).next();
  }

  function _setupTable2(tableData) {
    var properties = tableData.condition.attributes.concat(tableData.condition.properties);
    console.log(properties); // reset

    _classPrivateFieldSet(this, _tableData$1, tableData);

    _classPrivateFieldGet(this, _intersctionObserver).unobserve(_classPrivateFieldGet(this, _TABLE_END));

    _classPrivateFieldGet(this, _ROOT$2).classList.remove('-complete');

    _classPrivateFieldGet(this, _THEAD).innerHTML = '';
    _classPrivateFieldGet(this, _TBODY).innerHTML = '';

    _classPrivateFieldGet(this, _LOADING_VIEW).classList.add('-shown');

    DefaultEventEmitter$1.dispatchEvent(new CustomEvent('hideStanza')); // make table header

    _classPrivateFieldGet(this, _THEAD).innerHTML = "\n      <th>\n        <div class=\"inner\">\n          <div class=\"togo-key-view\">".concat(tableData.condition.togoKey, "</div>\n        </div>\n      </th>\n      ").concat(tableData.condition.attributes.map(function (property) {
      return "\n      <th>\n        <div class=\"inner -propertyvalue\" style=\"background-color: ".concat(App$1.getHslColor(property.subject.hue), "\">\n          <div class=\"togo-key-view\">").concat(property.property.primaryKey, "</div>\n          <span>").concat(property.property.label, "</span>\n        </div>\n      </th>");
    }).join(''), "\n      ").concat(tableData.condition.properties.map(function (property) {
      return "\n      <th>\n        <div class=\"inner -property\" style=\"color: ".concat(App$1.getHslColor(property.subject.hue), "\">\n          <div class=\"togo-key-view\">").concat(property.property.primaryKey, "</div>\n          <span>").concat(property.property.label, "</span>\n        </div>\n      </th>");
    }).join('')); // make stats

    _classPrivateFieldGet(this, _STATS).innerHTML = '<td><div class="inner"><div></td>' + properties.map(function () {
      return "<td><div class=\"inner\"><div></div></div></td>";
    }).join('');

    _classPrivateFieldGet(this, _STATS).querySelectorAll(':scope > td > .inner > div').forEach(function (elm, index) {
      if (index === 0) return;
      new StatisticsView(elm, properties[index - 1]);
    });
  }

  function _addTableRows2(detail) {
    var _this2 = this;

    _classPrivateFieldSet(this, _tableData$1, detail.tableData); // normalize


    var rows = [];
    detail.rows.forEach(function (row) {
      rows.push(_toConsumableArray(detail.tableData.serializedHeader.map(function (head) {
        return row.properties.find(function (property) {
          return property.propertyId === head;
        });
      })));
    }); // make table

    _classPrivateFieldGet(this, _TBODY).insertAdjacentHTML('beforeend', rows.map(function (row, index) {
      return "<tr data-index=\"".concat(detail.tableData.offset + index, "\" data-togo-id=\"").concat(detail.rows[index].id, "\">\n        <th>\n          <div class=\"inner\">\n            <div class=\"togo-key-view\">").concat(detail.rows[index].id, "</div>\n          </div>\n        </th>\n        ").concat(row.map(function (column) {
        // console.log(column)
        if (column) {
          return "\n              <td><div class=\"inner\"><ul>".concat(column.attributes.map(function (attribute) {
            if (!attribute.attribute) console.error(attribute);
            return "\n              <li>\n                <div class=\"togo-key-view\">".concat(attribute.id, "</div>\n                <a\n                  href=\"").concat(attribute.attribute ? attribute.attribute.uri : '', "\"\n                  title=\"").concat(attribute.attribute ? attribute.attribute.uri : '', "\"\n                  target=\"_blank\">").concat(attribute.attribute ? attribute.attribute.label : attribute, "</a>\n              </li>");
          }).join(''), "</ul></div></td>");
        } else {
          return '<td><div class="inner -empty"></div></td>';
        }
      }).join(''), "\n      </tr>");
    }).join('')); // turn off auto-loading after last line is displayed


    if (detail.done) {
      _classPrivateFieldGet(this, _ROOT$2).classList.add('-complete');

      _classPrivateFieldGet(this, _LOADING_VIEW).classList.remove('-shown');
    } else {
      _classPrivateFieldGet(this, _ROOT$2).classList.remove('-complete');

      _classPrivateFieldGet(this, _LOADING_VIEW).classList.add('-shown');

      _classPrivateFieldGet(this, _intersctionObserver).observe(_classPrivateFieldGet(this, _TABLE_END));
    } // attach event


    rows.forEach(function (row, index) {
      var actualIndex = detail.tableData.offset + index;

      var tr = _classPrivateFieldGet(_this2, _TBODY).querySelector(":scope > tr[data-index=\"".concat(actualIndex, "\"]"));

      tr.addEventListener('click', function () {
        if (tr.classList.contains('-selected')) {
          // hide stanza
          tr.classList.remove('-selected');
          DefaultEventEmitter$1.dispatchEvent(new CustomEvent('hideStanza'));
        } else {
          // show stanza
          _classPrivateFieldGet(_this2, _TBODY).querySelectorAll(':scope > tr').forEach(function (tr) {
            return tr.classList.remove('-selected');
          });

          tr.classList.add('-selected'); // dispatch event

          var event = new CustomEvent('showStanza', {
            detail: {
              subject: {
                togoKey: _classPrivateFieldGet(_this2, _tableData$1).togoKey,
                id: _classPrivateFieldGet(_this2, _tableData$1).subjectId,
                value: tr.dataset.togoId
              },
              properties: row
            }
          });
          DefaultEventEmitter$1.dispatchEvent(event);
        }
      });
    });
  }

  function _failed2(tableData) {
    console.log(tableData);

    _classPrivateFieldGet(this, _ROOT$2).classList.add('-complete');

    _classPrivateFieldGet(this, _LOADING_VIEW).classList.remove('-shown');
  }

  var _ROOT$1 = new WeakMap();

  var _CONTAINER = new WeakMap();

  var BalloonView = function BalloonView() {
    var _this = this;

    _classCallCheck(this, BalloonView);

    _ROOT$1.set(this, {
      writable: true,
      value: void 0
    });

    _CONTAINER.set(this, {
      writable: true,
      value: void 0
    });

    // make element
    _classPrivateFieldSet(this, _ROOT$1, document.createElement('div'));

    _classPrivateFieldGet(this, _ROOT$1).className = 'balloon-view';
    document.querySelector('body').insertAdjacentElement('beforeend', _classPrivateFieldGet(this, _ROOT$1));
    _classPrivateFieldGet(this, _ROOT$1).innerHTML = '<div class="container"></div>';

    _classPrivateFieldSet(this, _CONTAINER, _classPrivateFieldGet(this, _ROOT$1).querySelector(':scope > .container')); // event listener


    DefaultEventEmitter$1.addEventListener('enterPropertyValueItemView', function (e) {
      _classPrivateFieldGet(_this, _CONTAINER).innerHTML = "\n        <header>".concat(e.detail.label, "</header>\n        ").concat(e.detail.values.map(function (value) {
        return "<dl>\n          <dt>".concat(value.key, ":</dt>\n          <dd>").concat(value.value, "</dd>\n        </dl>");
      }).join('')); // geography

      var rect = e.detail.elm.getBoundingClientRect();
      var isBelow = window.innerHeight * .3 > rect.top;
      _classPrivateFieldGet(_this, _ROOT$1).style.left = rect.left + rect.width * .5 + 'px';

      if (isBelow) {
        _classPrivateFieldGet(_this, _ROOT$1).classList.add('-below');

        _classPrivateFieldGet(_this, _ROOT$1).style.top = rect.top + 10 + 'px';
      } else {
        _classPrivateFieldGet(_this, _ROOT$1).classList.remove('-below');

        _classPrivateFieldGet(_this, _ROOT$1).style.top = rect.top + 'px';
      }

      _classPrivateFieldGet(_this, _ROOT$1).classList.add('-showing');
    });
    DefaultEventEmitter$1.addEventListener('leavePropertyValueItemView', function (e) {
      _classPrivateFieldGet(_this, _ROOT$1).classList.remove('-showing');
    });
  };

  var LIMIT = 10;

  var _condition = new WeakMap();

  var _serializedHeader = new WeakMap();

  var _queryIds = new WeakMap();

  var _rows = new WeakMap();

  var _abortController = new WeakMap();

  var _isAutoLoad = new WeakMap();

  var _isLoaded = new WeakMap();

  var _ROOT = new WeakMap();

  var _STATUS = new WeakMap();

  var _INDICATOR_TEXT = new WeakMap();

  var _INDICATOR_BAR = new WeakMap();

  var _BUTTON_PREPARE_DOWNLOAD = new WeakMap();

  var _getQueryIds = new WeakSet();

  var _getProperties = new WeakSet();

  var _autoLoad = new WeakSet();

  var _complete = new WeakSet();

  var TableData = /*#__PURE__*/function () {
    function TableData(condition, elm) {
      var _this = this;

      _classCallCheck(this, TableData);

      _complete.add(this);

      _autoLoad.add(this);

      _getProperties.add(this);

      _getQueryIds.add(this);

      _condition.set(this, {
        writable: true,
        value: void 0
      });

      _serializedHeader.set(this, {
        writable: true,
        value: void 0
      });

      _queryIds.set(this, {
        writable: true,
        value: void 0
      });

      _rows.set(this, {
        writable: true,
        value: void 0
      });

      _abortController.set(this, {
        writable: true,
        value: void 0
      });

      _isAutoLoad.set(this, {
        writable: true,
        value: void 0
      });

      _isLoaded.set(this, {
        writable: true,
        value: void 0
      });

      _ROOT.set(this, {
        writable: true,
        value: void 0
      });

      _STATUS.set(this, {
        writable: true,
        value: void 0
      });

      _INDICATOR_TEXT.set(this, {
        writable: true,
        value: void 0
      });

      _INDICATOR_BAR.set(this, {
        writable: true,
        value: void 0
      });

      _BUTTON_PREPARE_DOWNLOAD.set(this, {
        writable: true,
        value: void 0
      });

      console.log(condition);

      _classPrivateFieldSet(this, _isAutoLoad, false);

      _classPrivateFieldSet(this, _isLoaded, false);

      _classPrivateFieldSet(this, _condition, condition);

      _classPrivateFieldSet(this, _serializedHeader, [].concat(_toConsumableArray(condition.attributes.map(function (property) {
        return property.query.propertyId;
      })), _toConsumableArray(condition.properties.map(function (property) {
        return property.query.propertyId;
      }))));

      _classPrivateFieldSet(this, _queryIds, []);

      _classPrivateFieldSet(this, _rows, []); // view


      elm.classList.add('table-data-controller-view');
      elm.dataset.status = 'load ids';
      elm.innerHTML = "\n    <div class=\"conditions\">\n      <div class=\"condiiton\">\n        <p title=\"".concat(condition.togoKey, "\">").concat(condition.togoKey, "</p>\n      </div>\n      ").concat(condition.attributes.map(function (property) {
        return "<div class=\"condiiton -value\" style=\"background-color: hsl(".concat(property.subject.hue, ", 45%, 50%)\">\n        <p title=\"").concat(property.property.label, "\">").concat(property.property.label, "</p>\n      </div>");
      }).join(''), "\n      ").concat(condition.properties.map(function (property) {
        return "<div class=\"condiiton -value\" style=\"color: hsl(".concat(property.subject.hue, ", 45%, 50%)\">\n        <p title=\"").concat(property.property.label, "\">").concat(property.property.label, "</p>\n      </div>");
      }).join(''), "\n    </div>\n    <div class=\"status\">\n      <p>Getting id list</p>\n    </div>\n    <div class=\"indicator\">\n      <div class=\"text\"></div>\n      <div class=\"progress\">\n        <div class=\"bar\"></div>\n      </div>\n    </div>\n    <div class=\"controller\">\n      <div class=\"button\" title=\"Prepare for download\" data-button=\"prepare-download\">\n        <span class=\"material-icons-outlined\">download</span>\n      </div>\n      <div class=\"button\" title=\"Restore as condition\" data-button=\"restore\">\n        <span class=\"material-icons-outlined\">settings_backup_restore</span>\n      </div>\n      <div class=\"button\" title=\"Delete\" data-button=\"delete\">\n        <span class=\"material-icons-outlined\">delete</span>\n      </div>\n    </div>\n    <div class=\"downloads\">\n      <div class=\"button\" title=\"Download CSV\">\n        <span class=\"material-icons-outlined\">download</span>\n        CSV\n      </div>\n      <div class=\"button\" title=\"Download JSON \">\n        <span class=\"material-icons-outlined\">download</span>\n        JSON\n      </div>\n    </div>"); // reference

      _classPrivateFieldSet(this, _ROOT, elm);

      _classPrivateFieldSet(this, _STATUS, elm.querySelector(':scope > .status > p'));

      var INDICATOR = elm.querySelector(':scope > .indicator');

      _classPrivateFieldSet(this, _INDICATOR_TEXT, INDICATOR.querySelector(':scope > .text'));

      _classPrivateFieldSet(this, _INDICATOR_BAR, INDICATOR.querySelector(':scope > .progress > .bar'));

      var BUTTONS = _toConsumableArray(elm.querySelectorAll(':scope > .controller > .button'));

      _classPrivateFieldSet(this, _BUTTON_PREPARE_DOWNLOAD, BUTTONS.find(function (button) {
        return button.dataset.button === 'prepare-download';
      })); // events


      elm.addEventListener('click', function () {
        if (elm.classList.contains('-current')) return;

        _this.select();
      });

      _classPrivateFieldGet(this, _BUTTON_PREPARE_DOWNLOAD).addEventListener('click', function (e) {
        e.stopPropagation();

        _classPrivateMethodGet(_this, _autoLoad, _autoLoad2).call(_this);
      });

      BUTTONS.find(function (button) {
        return button.dataset.button === 'restore';
      }).addEventListener('click', function (e) {
        e.stopPropagation();
        console.log('restore');
      });
      BUTTONS.find(function (button) {
        return button.dataset.button === 'delete';
      }).addEventListener('click', function (e) {
        e.stopPropagation();
        console.log('delete');
      });
      this.select();

      _classPrivateMethodGet(this, _getQueryIds, _getQueryIds2).call(this);
    }
    /* private methods */


    _createClass(TableData, [{
      key: "select",
      value:
      /* public methods */
      function select() {
        _classPrivateFieldGet(this, _ROOT).classList.add('-current'); // dispatch event


        var event1 = new CustomEvent('selectTableData', {
          detail: this
        });
        DefaultEventEmitter$1.dispatchEvent(event1); // send rows

        if (_classPrivateFieldGet(this, _ROOT).dataset.status !== 'load ids') {
          var done = this.offset >= _classPrivateFieldGet(this, _queryIds).length;

          var event2 = new CustomEvent('addNextRows', {
            detail: {
              tableData: this,
              rows: _classPrivateFieldGet(this, _rows),
              done: done
            }
          });
          DefaultEventEmitter$1.dispatchEvent(event2);
        }
      }
    }, {
      key: "deselect",
      value: function deselect() {
        _classPrivateFieldGet(this, _ROOT).classList.remove('-current');
      }
    }, {
      key: "next",
      value: function next() {
        if (_classPrivateFieldGet(this, _isAutoLoad)) return;

        _classPrivateMethodGet(this, _getProperties, _getProperties2).call(this);
      }
      /* public accessors */

    }, {
      key: "offset",
      get: function get() {
        return _classPrivateFieldGet(this, _rows).length;
      }
    }, {
      key: "togoKey",
      get: function get() {
        return this.condition.togoKey;
      }
    }, {
      key: "subjectId",
      get: function get() {
        return this.condition.subjectId;
      }
    }, {
      key: "condition",
      get: function get() {
        return _classPrivateFieldGet(this, _condition);
      }
    }, {
      key: "serializedHeader",
      get: function get() {
        return _classPrivateFieldGet(this, _serializedHeader);
      }
    }, {
      key: "data",
      get: function get() {
        return _classPrivateFieldGet(this, _rows);
      }
    }, {
      key: "rateOfProgress",
      get: function get() {
        return _classPrivateFieldGet(this, _rows).length / _classPrivateFieldGet(this, _queryIds).length;
      }
    }]);

    return TableData;
  }();

  function _getQueryIds2() {
    var _this2 = this;

    // reset
    _classPrivateFieldSet(this, _abortController, new AbortController());

    _classPrivateFieldGet(this, _ROOT).classList.add('-fetching'); // set parameters


    fetch("".concat(App$1.aggregatePrimaryKeys, "?togoKey=").concat(_classPrivateFieldGet(this, _condition).togoKey, "&properties=").concat(encodeURIComponent(JSON.stringify(_classPrivateFieldGet(this, _condition).attributes.map(function (property) {
      return property.query;
    })))), {
      signal: _classPrivateFieldGet(this, _abortController).signal
    }).catch(function (error) {
      throw Error(error);
    }).then(function (responce) {
      console.log(responce);

      if (responce.ok) {
        return responce;
      }

      _classPrivateFieldGet(_this2, _STATUS).classList.add('-error');

      _classPrivateFieldGet(_this2, _STATUS).textContent = "".concat(responce.status, " (").concat(responce.statusText, ")");
      throw Error(responce);
    }).then(function (responce) {
      // const reader = responce.body.getReader();
      // console.log(reader);
      return responce.json();
    }).then(function (queryIds) {
      console.log(queryIds);

      _classPrivateFieldSet(_this2, _queryIds, queryIds);

      if (queryIds.length === 0) {
        console.log('****** 0 ken');

        _classPrivateMethodGet(_this2, _complete, _complete2).call(_this2);

        return;
      } // display


      _classPrivateFieldGet(_this2, _ROOT).dataset.status = 'load rows';
      _classPrivateFieldGet(_this2, _STATUS).textContent = '';
      _classPrivateFieldGet(_this2, _INDICATOR_TEXT).innerHTML = "".concat(_this2.offset.toLocaleString(), " / ").concat(_classPrivateFieldGet(_this2, _queryIds).length.toLocaleString());

      _classPrivateMethodGet(_this2, _getProperties, _getProperties2).call(_this2);
    }).catch(function (error) {
      // TODO:
      console.error(error);
      var event = new CustomEvent('failedFetchTableDataIds', {
        detail: _this2
      });
      DefaultEventEmitter$1.dispatchEvent(event);
    }).finally(function () {
      _classPrivateFieldGet(_this2, _ROOT).classList.remove('-fetching');
    });
  }

  function _getProperties2() {
    var _this3 = this;

    _classPrivateFieldGet(this, _ROOT).classList.add('-fetching');

    _classPrivateFieldGet(this, _STATUS).textContent = 'Getting data';
    fetch("".concat(App$1.aggregateRows, "?togoKey=").concat(_classPrivateFieldGet(this, _condition).togoKey, "&properties=").concat(encodeURIComponent(JSON.stringify(_classPrivateFieldGet(this, _condition).attributes.map(function (property) {
      return property.query;
    }).concat(_classPrivateFieldGet(this, _condition).properties.map(function (property) {
      return property.query;
    })))), "&queryIds=").concat(encodeURIComponent(JSON.stringify(_classPrivateFieldGet(this, _queryIds).slice(this.offset, this.offset + LIMIT)))), {
      signal: _classPrivateFieldGet(this, _abortController).signal
    }).then(function (responce) {
      return responce.json();
    }).then(function (rows) {
      var _classPrivateFieldGet2;

      console.log(rows);

      (_classPrivateFieldGet2 = _classPrivateFieldGet(_this3, _rows)).push.apply(_classPrivateFieldGet2, _toConsumableArray(rows));

      _classPrivateFieldSet(_this3, _isLoaded, _this3.offset >= _classPrivateFieldGet(_this3, _queryIds).length); // display


      _classPrivateFieldGet(_this3, _ROOT).classList.remove('-fetching');

      _classPrivateFieldGet(_this3, _STATUS).textContent = 'Awaiting';
      _classPrivateFieldGet(_this3, _INDICATOR_TEXT).innerHTML = "".concat(_this3.offset.toLocaleString(), " / ").concat(_classPrivateFieldGet(_this3, _queryIds).length.toLocaleString());
      _classPrivateFieldGet(_this3, _INDICATOR_BAR).style.width = "".concat(_this3.offset / _classPrivateFieldGet(_this3, _queryIds).length * 100, "%"); // dispatch event

      var event = new CustomEvent('addNextRows', {
        detail: {
          tableData: _this3,
          rows: rows,
          done: _classPrivateFieldGet(_this3, _isLoaded)
        }
      });
      DefaultEventEmitter$1.dispatchEvent(event); // turn off after finished

      if (_classPrivateFieldGet(_this3, _isLoaded)) {
        _classPrivateMethodGet(_this3, _complete, _complete2).call(_this3);
      } else if (_classPrivateFieldGet(_this3, _isAutoLoad)) {
        _classPrivateMethodGet(_this3, _getProperties, _getProperties2).call(_this3);
      }
    }).catch(function (error) {
      _classPrivateFieldGet(_this3, _ROOT).classList.remove('-fetching');

      console.error(error); // TODO:
    });
  }

  function _autoLoad2() {
    if (_classPrivateFieldGet(this, _isLoaded)) return;

    _classPrivateFieldSet(this, _isAutoLoad, true);

    _classPrivateFieldGet(this, _ROOT).classList.add('-autoload');

    _classPrivateMethodGet(this, _getProperties, _getProperties2).call(this);
  }

  function _complete2() {
    _classPrivateFieldGet(this, _ROOT).dataset.status = 'complete';
    _classPrivateFieldGet(this, _STATUS).textContent = 'Complete';
  }

  var _tableData = new WeakMap();

  var _body = new WeakMap();

  var _conditionsContainer = new WeakMap();

  var _setTableData = new WeakSet();

  var _selectTableData = new WeakSet();

  var ConditionsController = function ConditionsController(_elm) {
    var _this = this;

    _classCallCheck(this, ConditionsController);

    _selectTableData.add(this);

    _setTableData.add(this);

    _tableData.set(this, {
      writable: true,
      value: void 0
    });

    _body.set(this, {
      writable: true,
      value: void 0
    });

    _conditionsContainer.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _tableData, []); // references


    _classPrivateFieldSet(this, _conditionsContainer, _elm.querySelector(':scope > .conditions'));

    _classPrivateFieldSet(this, _body, document.querySelector('body')); // event listener


    DefaultEventEmitter$1.addEventListener('completeQueryParameter', function (e) {
      return _classPrivateMethodGet(_this, _setTableData, _setTableData2).call(_this, e.detail);
    });
    DefaultEventEmitter$1.addEventListener('selectTableData', function (e) {
      return _classPrivateMethodGet(_this, _selectTableData, _selectTableData2).call(_this, e.detail);
    });
  }
  /* private methods */
  ;

  function _setTableData2(newCondition) {
    // find matching condition from already existing conditions
    // TODO: うまく検出できていない
    var sameConditionTableData = _classPrivateFieldGet(this, _tableData).find(function (tableData) {
      var matchTogoKey = newCondition.togoKey === tableData.condition.togoKey; // compare properties

      var matchProperties = newCondition.properties.every(function (newProperty) {
        return tableData.condition.properties.find(function (property) {
          return newProperty.query.propertyId === property.query.propertyId;
        });
      }); // compare attributes

      var matchAttributes = newCondition.attributes.every(function (newProperty) {
        return tableData.condition.attributes.find(function (property) {
          var matchId = newProperty.query.propertyId === property.query.propertyId;
          var matchValues = newProperty.query.categoryIds.every(function (categoryId) {
            return property.query.categoryIds.indexOf(categoryId) !== -1;
          });
          return matchId && matchValues;
        });
      });
      return matchTogoKey && matchProperties && matchAttributes;
    });

    if (sameConditionTableData) {
      // use existing table data
      sameConditionTableData.select();
    } else {
      // make new table data
      var elm = document.createElement('div');

      _classPrivateFieldGet(this, _conditionsContainer).insertAdjacentElement('afterbegin', elm);

      _classPrivateFieldGet(this, _tableData).push(new TableData(newCondition, elm));
    }
  }

  function _selectTableData2(selectedTableData) {
    _classPrivateFieldGet(this, _body).dataset.display = 'results'; // deselect

    var _iterator = _createForOfIteratorHelper(_classPrivateFieldGet(this, _tableData)),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var tableData = _step.value;
        if (tableData !== selectedTableData) tableData.deselect();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  var CONF_PROPERTIES = 'https://raw.githubusercontent.com/dbcls/togosite/develop/config/togosite-human/properties.json';
  var CONF_TEMPLATES = 'https://raw.githubusercontent.com/dbcls/togosite/develop/config/togosite-human/templates.json';
  var CONF_AGGREGATE = 'https://raw.githubusercontent.com/dbcls/togosite/develop/config/togosite-human/aggregate.json';

  var _viewModes = new WeakMap();

  var _aggregate = new WeakMap();

  var _makeConceptViews = new WeakSet();

  var App = /*#__PURE__*/function () {
    function App() {
      _classCallCheck(this, App);

      _makeConceptViews.add(this);

      _viewModes.set(this, {
        writable: true,
        value: void 0
      });

      _aggregate.set(this, {
        writable: true,
        value: void 0
      });

      window.app = this;
    }

    _createClass(App, [{
      key: "ready",
      value: function ready() {
        var _this = this;

        var body = document.querySelector('body'); // view modes

        _classPrivateFieldSet(this, _viewModes, {});

        document.querySelectorAll('#Properties > .header > nav .viewmodecontroller input[type="checkbox"]').forEach(function (checkbox) {
          _classPrivateFieldGet(_this, _viewModes)[checkbox.value] = checkbox.checked;
          checkbox.addEventListener('click', function () {
            if (checkbox.value === 'heatmap') body.dataset.heatmap = checkbox.checked;
            _classPrivateFieldGet(_this, _viewModes)[checkbox.value] = checkbox.checked;
            var event = new CustomEvent('changeViewModes', {
              detail: _classPrivateFieldGet(_this, _viewModes)
            });
            DefaultEventEmitter$1.dispatchEvent(event);
          });
        }); // set up views

        var conditionBuilderView = new ConditionBuilderView(document.querySelector('#ConditionBuilder'));
        new ConditionsController(document.querySelector('#Conditions'));
        var reportsView = new ReportsView(document.querySelector('#Reports'));
        new ResultsTable(document.querySelector('#ResultsTable'));
        new BalloonView(); // load config json

        var stanzaTtemplates;
        Promise.all([fetch(CONF_PROPERTIES), fetch(CONF_TEMPLATES), fetch(CONF_AGGREGATE)]).then(function (responces) {
          return Promise.all(responces.map(function (responce) {
            return responce.json();
          }));
        }).then(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 3),
              subjects = _ref2[0],
              templates = _ref2[1],
              aggregate = _ref2[2];

          stanzaTtemplates = templates;
          Records$1.setSubjects(subjects); // define primary keys

          var togoKeys = subjects.map(function (subject) {
            return {
              label: subject.subject,
              togoKey: subject.togoKey,
              subjectId: subject.subjectId
            };
          });
          conditionBuilderView.defineTogoKeys(togoKeys); // set stanza scripts

          document.querySelector('head').insertAdjacentHTML('beforeend', templates.stanzas.map(function (stanza) {
            return "<script type=\"module\" src=\"".concat(stanza, "\"></script>");
          }).join('')); // aggregate

          _classPrivateFieldSet(_this, _aggregate, Object.freeze(aggregate)); // get stanza templates


          return Promise.all(Object.keys(templates.templates).map(function (key) {
            return fetch(templates.templates[key]);
          }));
        }).then(function (responces) {
          return Promise.all(responces.map(function (responce) {
            return responce.text();
          }));
        }).then(function (templates) {
          // set stanza templates
          var stanzaTemplates = Object.fromEntries(Object.keys(stanzaTtemplates.templates).map(function (stanza, index) {
            return [stanza, templates[index]];
          }));
          reportsView.defineTemplates(stanzaTemplates); // define properties (app start)

          _classPrivateMethodGet(_this, _makeConceptViews, _makeConceptViews2).call(_this); // Records.setSubjects(this.#subjects);

        });
      } // private methods

    }, {
      key: "getHslColor",
      value: // public methods
      // utilities
      function getHslColor(hue) {
        return "hsl(".concat(hue, ", 50%, 55%)");
      } // accessor

    }, {
      key: "viewModes",
      get: function get() {
        return _classPrivateFieldGet(this, _viewModes);
      }
    }, {
      key: "aggregatePrimaryKeys",
      get: function get() {
        return _classPrivateFieldGet(this, _aggregate).filter.url;
      }
    }, {
      key: "aggregateRows",
      get: function get() {
        return _classPrivateFieldGet(this, _aggregate).table.url;
      }
    }]);

    return App;
  }();

  function _makeConceptViews2() {
    var conceptsContainer = document.querySelector('#Properties > .concepts');
    console.log(Records$1);
    console.log(Records$1.subjects);
    Records$1.subjects.forEach(function (subject) {
      var elm = document.createElement('section');
      new ConceptView(subject, elm);
      conceptsContainer.insertAdjacentElement('beforeend', elm);
    });
  }

  var App$1 = new App();

  globalThis.togositeapp = App$1;
  App$1.ready();

}());
//# sourceMappingURL=main.js.map
