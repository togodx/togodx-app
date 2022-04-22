var Attribute = (function () {
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
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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

  function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
      throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
  }

  function _classPrivateFieldInitSpec(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);

    privateMap.set(obj, value);
  }

  var _id = /*#__PURE__*/new WeakMap();

  var _obj = /*#__PURE__*/new WeakMap();

  var _values = /*#__PURE__*/new WeakMap();

  var Attribute = /*#__PURE__*/function () {
    function Attribute(id, obj) {
      _classCallCheck(this, Attribute);

      _classPrivateFieldInitSpec(this, _id, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _obj, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _values, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(this, _id, id);

      _classPrivateFieldSet(this, _obj, obj);

      _classPrivateFieldSet(this, _values, []);
    } // public Methods


    _createClass(Attribute, [{
      key: "fetchValuesWithParentCategoryId",
      value: function fetchValuesWithParentCategoryId(parentCategoryId) {
        var _this = this;

        return new Promise(function (resolve, reject) {
          var values = _classPrivateFieldGet(_this, _values).filter(function (value) {
            return value.parentCategoryId === parentCategoryId;
          });

          if (values.length > 0) {
            resolve(values);
          } else {
            var body = {};
            if (parentCategoryId) body.node = parentCategoryId;
            if (_this.order) body.order = _this.order;
            fetch(_this.api, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
            }).then(function (responce) {
              return responce.json();
            }).then(function (values) {
              var _classPrivateFieldGet2;

              var __zzz__values = values.map(function (value) {
                return {
                  node: value.node,
                  count: value.count,
                  hasChild: !value.tip,
                  label: value.label
                };
              }); // set parent category id
              // if (parentCategoryId) values.forEach(value => value.parentCategoryId = parentCategoryId);


              if (parentCategoryId) __zzz__values.forEach(function (value) {
                return value.parentCategoryId = parentCategoryId;
              }); // set values
              // this.#values.push(...values);

              (_classPrivateFieldGet2 = _classPrivateFieldGet(_this, _values)).push.apply(_classPrivateFieldGet2, _toConsumableArray(__zzz__values)); // resolve(values);


              resolve(__zzz__values);
            }).catch(function (error) {
              console.error(_this, error);
              reject(error);
            });
          }
        });
      }
    }, {
      key: "getValue",
      value: function getValue(node) {
        return _classPrivateFieldGet(this, _values).find(function (value) {
          return value.node === node;
        });
      } // accessors

    }, {
      key: "id",
      get: function get() {
        return _classPrivateFieldGet(this, _id);
      }
    }, {
      key: "label",
      get: function get() {
        return _classPrivateFieldGet(this, _obj).label;
      }
    }, {
      key: "description",
      get: function get() {
        return _classPrivateFieldGet(this, _obj).description;
      }
    }, {
      key: "api",
      get: function get() {
        return _classPrivateFieldGet(this, _obj).api;
      }
    }, {
      key: "dataset",
      get: function get() {
        return _classPrivateFieldGet(this, _obj).dataset;
      }
    }, {
      key: "datamodel",
      get: function get() {
        return _classPrivateFieldGet(this, _obj).datamodel;
      }
    }, {
      key: "source",
      get: function get() {
        return _classPrivateFieldGet(this, _obj).source;
      }
    }, {
      key: "order",
      get: function get() {
        return _classPrivateFieldGet(this, _obj).order;
      }
    }, {
      key: "values",
      get: function get() {
        return _classPrivateFieldGet(this, _values);
      }
    }]);

    return Attribute;
  }();

  return Attribute;

})();
//# sourceMappingURL=Attribute.js.map
