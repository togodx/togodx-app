(function () {
  'use strict';

  function ownKeys$1(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) {
        _defineProperty$1(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

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

  function _defineProperty$1(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    Object.defineProperty(subClass, "prototype", {
      value: Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      }),
      writable: false
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

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
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
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
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
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
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
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
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
        it = it.call(o);
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

  function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
      throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
  }

  function _classPrivateFieldInitSpec(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);

    privateMap.set(obj, value);
  }

  function _classPrivateMethodInitSpec(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);

    privateSet.add(obj);
  }

  var DefaultEventEmitter = /*#__PURE__*/function (_EventTarget) {
    _inherits(DefaultEventEmitter, _EventTarget);

    var _super = _createSuper(DefaultEventEmitter);

    function DefaultEventEmitter() {
      _classCallCheck(this, DefaultEventEmitter);

      return _super.call(this);
    }

    return _createClass(DefaultEventEmitter);
  }( /*#__PURE__*/_wrapNativeSuper(EventTarget));

  var DefaultEventEmitter$1 = new DefaultEventEmitter();

  var _excluded = ["method"],
      _excluded2 = ["format"],
      _excluded3 = ["format"],
      _excluded4 = ["inGamut", "commas", "format"],
      _excluded5 = ["precision", "commas", "format", "inGamut"],
      _excluded6 = ["format", "commas", "inGamut"],
      _excluded7 = ["format"],
      _excluded8 = ["maxDeltaE", "deltaEMethod", "steps", "maxSteps"];

  function t(t, e) {
    var r = t.length;
    Array.isArray(t[0]) || (t = [t]), Array.isArray(e[0]) || (e = e.map(function (t) {
      return [t];
    }));
    var a = e[0].length,
        s = e[0].map(function (t, r) {
      return e.map(function (t) {
        return t[r];
      });
    }),
        o = t.map(function (t) {
      return s.map(function (e) {
        return Array.isArray(t) ? t.reduce(function (t, r, a) {
          return t + r * (e[a] || 0);
        }, 0) : e.reduce(function (e, r) {
          return e + r * t;
        }, 0);
      });
    });
    return 1 === r && (o = o[0]), 1 === a ? o.map(function (t) {
      return t[0];
    }) : o;
  }

  function e(t) {
    return "string" === r(t);
  }

  function r(t) {
    return (Object.prototype.toString.call(t).match(/^\[object\s+(.*?)\]$/)[1] || "").toLowerCase();
  }

  function a(t) {
    for (var _len = arguments.length, e = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      e[_key - 1] = arguments[_key];
    }

    for (var _i = 0, _e = e; _i < _e.length; _i++) {
      var _r = _e[_i];

      if (_r) {
        var _e2 = Object.getOwnPropertyDescriptors(_r);

        Object.defineProperties(t, _e2);
      }
    }

    return t;
  }

  function s(t, e, r) {
    var a = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(t, r, a);
  }

  function o(t, e) {
    e = +e;
    var r = (Math.floor(t) + "").length;
    if (e > r) return +t.toFixed(e - r);
    {
      var _a = Math.pow(10, r - e);

      return Math.round(t / _a) * _a;
    }
  }

  function i(t) {
    if (t.indexOf(".") > 0) {
      var _t$split = t.split("."),
          _t$split2 = _slicedToArray(_t$split, 2),
          _e3 = _t$split2[0],
          _r2 = _t$split2[1],
          _a2 = Color.space(_e3);

      if (!(_r2 in _a2.coords)) throw new ReferenceError("Color space \"".concat(_a2.name, "\" has no \"").concat(_r2, "\" coordinate."));
      return [_a2, _r2];
    }
  }

  function n(t, e, r) {
    var a = e.split("."),
        s = a.pop();
    if (t = a.reduceRight(function (t, e) {
      return t && t[e];
    }, t)) return void 0 === r ? t[s] : t[s] = r;
  }

  var c = Object.freeze({
    __proto__: null,
    isString: e,
    type: r,
    extend: a,
    copyDescriptor: s,
    capitalize: function capitalize(t) {
      return t ? t[0].toUpperCase() + t.slice(1) : t;
    },
    toPrecision: o,
    parseCoord: i,
    value: n,
    multiplyMatrices: t
  });
  var l = "undefined" != typeof document;

  var h = /*#__PURE__*/function () {
    function h() {
      _classCallCheck(this, h);

      var r, a;

      for (var _len2 = arguments.length, t = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        t[_key2] = arguments[_key2];
      }

      if (t[0] && "object" == _typeof(t[0]) && (t[0].space || t[0].spaceId) && t[0].coords) a = t[0];else if (e(t[0])) {
        if (l && 0 === t[0].indexOf("--")) {
          var _t = arguments[1] && 1 === arguments[1].nodeType ? arguments[1] : document.documentElement;

          r = getComputedStyle(_t).getPropertyValue(arguments[0]);
        } else 1 === t.length && (r = t[0]);

        r && (a = h.parse(r));
      }
      if (a) "spaceId" in a ? this.spaceId = a.spaceId : this.space = a.space, this.coords = a.coords.slice(), this.alpha = a.alpha;else {
        var _ref, _t2, _t3;

        var _e4, _r3, _a3;

        Array.isArray(t[0]) ? (_ref = ["sRGB"].concat(t), _e4 = _ref[0], _r3 = _ref[1], _a3 = _ref[2], _ref) : (_t2 = t, _t3 = _slicedToArray(_t2, 3), _e4 = _t3[0], _r3 = _t3[1], _a3 = _t3[2], _t2), this.spaceId = _e4 || "sRGB", this.coords = _r3 ? _r3.slice() : [0, 0, 0], this.alpha = _a3;
      }
      this.alpha = this.alpha < 1 ? this.alpha : 1;

      for (var _t4 = 0; _t4 < this.coords.length; _t4++) {
        "NaN" === this.coords[_t4] && (this.coords[_t4] = NaN);
      }
    }

    _createClass(h, [{
      key: "space",
      get: function get() {
        return h.spaces[this.spaceId];
      },
      set: function set(t) {
        return this.spaceId = t;
      }
    }, {
      key: "spaceId",
      get: function get() {
        return this._spaceId;
      },
      set: function set(t) {
        var e = h.space(t);

        if (t = e.id, this.space && e && this.space !== e) {
          this.coords = this[t];

          for (var _t5 in this.space.instance) {
            this.hasOwnProperty(_t5) && delete this[_t5];
          }
        }

        this._spaceId = t, a(this, this.space.instance);
      }
    }, {
      key: "white",
      get: function get() {
        return this.space.white || h.whites.D50;
      }
    }, {
      key: "set",
      value: function set(t, e) {
        if (1 === arguments.length && "object" === r(arguments[0])) {
          var _t6 = arguments[0];

          for (var _e5 in _t6) {
            this.set(_e5, _t6[_e5]);
          }
        } else if ("function" == typeof e) {
          var _r4 = n(this, t);

          n(this, t, e.call(this, _r4));
        } else n(this, t, e);

        return this;
      }
    }, {
      key: "lighten",
      value: function lighten() {
        var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : .25;
        var e = new h(this),
            r = e.lightness;
        return e.lightness = r * (1 + t), e;
      }
    }, {
      key: "darken",
      value: function darken() {
        var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : .25;
        var e = new h(this),
            r = e.lightness;
        return e.lightness = r * (1 - t), e;
      }
    }, {
      key: "distance",
      value: function distance(t) {
        var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "lab";
        t = h.get(t);
        var r = this[(e = h.space(e)).id],
            a = t[e.id];
        return Math.sqrt(r.reduce(function (t, e, r) {
          return isNaN(e) || isNaN(a[r]) ? t : t + Math.pow(a[r] - e, 2);
        }, 0));
      }
    }, {
      key: "deltaE",
      value: function deltaE(t) {
        var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        e(r) && (r = {
          method: r
        });

        var _r5 = r,
            _r5$method = _r5.method,
            a = _r5$method === void 0 ? h.defaults.deltaE : _r5$method,
            s = _objectWithoutProperties(_r5, _excluded);

        return t = h.get(t), this["deltaE" + a] ? this["deltaE" + a](t, s) : this.deltaE76(t);
      }
    }, {
      key: "deltaE76",
      value: function deltaE76(t) {
        return this.distance(t, "lab");
      }
    }, {
      key: "luminance",
      get: function get() {
        return h.chromaticAdaptation(h.spaces.xyz.white, h.whites.D65, this.xyz)[1];
      },
      set: function set(t) {
        var e = h.chromaticAdaptation(h.spaces.xyz.white, h.whites.D65, this.xyz);
        e[1] = t, e = h.chromaticAdaptation(h.whites.D65, h.spaces.xyz.white, e), this.xyz.X = e[0], this.xyz.Y = e[1], this.xyz.Z = e[2];
      }
    }, {
      key: "contrast",
      value: function contrast(t) {
        var _ref2;

        t = h.get(t);
        var e = this.luminance,
            r = t.luminance;
        return r > e && (_ref2 = [r, e], e = _ref2[0], r = _ref2[1], _ref2), (e + .05) / (r + .05);
      }
    }, {
      key: "uv",
      get: function get() {
        var _this$xyz = _slicedToArray(this.xyz, 3),
            t = _this$xyz[0],
            e = _this$xyz[1],
            r = _this$xyz[2],
            a = t + 15 * e + 3 * r;

        return [4 * t / a, 9 * e / a];
      }
    }, {
      key: "xy",
      get: function get() {
        var _this$xyz2 = _slicedToArray(this.xyz, 3),
            t = _this$xyz2[0],
            e = _this$xyz2[1],
            r = _this$xyz2[2],
            a = t + e + r;

        return [t / a, e / a];
      }
    }, {
      key: "getCoords",
      value: function getCoords() {
        var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            t = _ref3.inGamut,
            _ref3$precision = _ref3.precision,
            e = _ref3$precision === void 0 ? h.defaults.precision : _ref3$precision;

        var r = this.coords;

        if (t && !this.inGamut() && (r = this.toGamut(!0 === t ? void 0 : t).coords), null != e) {
          var _t7 = this.space.coords ? Object.values(this.space.coords) : [];

          r = r.map(function (r, a) {
            return o(r, e, _t7[a]);
          });
        }

        return r;
      }
    }, {
      key: "inGamut",
      value: function inGamut() {
        var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.space;
        var e = arguments.length > 1 ? arguments[1] : undefined;
        return t = h.space(t), h.inGamut(t, this[t.id], e);
      }
    }, {
      key: "toGamut",
      value: function toGamut() {
        var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref4$method = _ref4.method,
            t = _ref4$method === void 0 ? h.defaults.gamutMapping : _ref4$method,
            _ref4$space = _ref4.space,
            r = _ref4$space === void 0 ? this.space : _ref4$space,
            a = _ref4.inPlace;

        if (e(arguments[0]) && (r = arguments[0]), r = h.space(r), this.inGamut(r, {
          epsilon: 0
        })) return this;
        var s = this.to(r);

        if (t.indexOf(".") > 0 && !this.inGamut(r)) {
          var _e6 = s.toGamut({
            method: "clip",
            space: r
          });

          if (this.deltaE(_e6, {
            method: "2000"
          }) > 2) {
            var _i2 = i(t),
                _i3 = _slicedToArray(_i2, 2),
                _e7 = _i3[0],
                _a4 = _i3[1],
                _o = s.to(_e7),
                _n = .01,
                _c = _e7.coords[_a4][0],
                _l = _o[_a4];

            for (; _l - _c > _n;) {
              var _t8 = _o.toGamut({
                space: r,
                method: "clip"
              });

              _o.deltaE(_t8, {
                method: "2000"
              }) - 2 < _n ? _c = _o[_a4] : _l = _o[_a4], _o[_a4] = (_l + _c) / 2;
            }

            s = _o.to(r);
          } else s = _e6;
        }

        if ("clip" === t || !s.inGamut(r, {
          epsilon: 0
        })) {
          var _t9 = Object.values(r.coords);

          s.coords = s.coords.map(function (e, r) {
            var _t9$r = _slicedToArray(_t9[r], 2),
                a = _t9$r[0],
                s = _t9$r[1];

            return void 0 !== a && (e = Math.max(a, e)), void 0 !== s && (e = Math.min(e, s)), e;
          });
        }

        return r.id !== this.spaceId && (s = s.to(this.space)), a ? (this.coords = s.coords, this) : s;
      }
    }, {
      key: "clone",
      value: function clone() {
        return new h(this.spaceId, this.coords, this.alpha);
      }
    }, {
      key: "to",
      value: function to(t) {
        var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            e = _ref5.inGamut;

        var r = (t = h.space(t)).id,
            a = new h(r, this[r], this.alpha);
        return e && a.toGamut({
          inPlace: !0
        }), a;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          spaceId: this.spaceId,
          coords: this.coords,
          alpha: this.alpha
        };
      }
    }, {
      key: "toString",
      value: function toString() {
        var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref6$precision = _ref6.precision,
            t = _ref6$precision === void 0 ? h.defaults.precision : _ref6$precision,
            r = _ref6.format,
            a = _ref6.commas,
            s = _ref6.inGamut,
            _ref6$name = _ref6.name,
            i = _ref6$name === void 0 ? "color" : _ref6$name,
            n = _ref6.fallback;

        var c = this.alpha < 1 ? " ".concat(a ? "," : "/", " ").concat(this.alpha) : "",
            p = this.getCoords({
          inGamut: s,
          precision: t
        });
        p = p.map(function (t) {
          return t || 0;
        }), e(r) && "%" === r && (r = function r(e) {
          return o(e *= 100, t) + "%";
        }), "function" == typeof r && (p = p.map(r));

        var u = _toConsumableArray(p);

        "color" === i && u.unshift(this.space ? this.space.cssId || this.space.id : "XYZ");
        var d = "".concat(i, "(").concat(u.join(a ? ", " : " ")).concat(c, ")");

        if (n) {
          if (!l || "undefined" == typeof CSS || CSS.supports("color", d)) return d = new String(d), d.color = this, d;

          var _e8 = Array.isArray(n) ? n.slice() : h.defaults.fallbackSpaces;

          for (var _r7, _a5 = 0; _r7 = _e8[_a5]; _a5++) {
            if (h.spaces[_r7]) {
              var _s = this.to(_r7);

              if (d = _s.toString({
                precision: t
              }), CSS.supports("color", d)) return d = new String(d), d.color = _s, d;
              _e8 === h.defaults.fallbackSpaces && (_e8.splice(_a5, 1), _a5--);
            }
          }

          var _r6 = this.to("srgb");

          d = new String(_r6.toString({
            commas: !0
          })), d.color = _r6;
        }

        return d;
      }
    }, {
      key: "equals",
      value: function equals(t) {
        return t = h.get(t), this.spaceId === t.spaceId && this.alpha === t.alpha && this.coords.every(function (e, r) {
          return e === t.coords[r];
        });
      }
    }], [{
      key: "inGamut",
      value: function inGamut(t, e) {
        var _ref7 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref7$epsilon = _ref7.epsilon,
            r = _ref7$epsilon === void 0 ? 75e-6 : _ref7$epsilon;

        if ((t = h.space(t)).inGamut) return t.inGamut(e);
        {
          if (!t.coords) return !0;

          var _a6 = Object.values(t.coords);

          return e.every(function (t, e) {
            if (Number.isNaN(t)) return !0;

            var _a6$e = _slicedToArray(_a6[e], 2),
                s = _a6$e[0],
                o = _a6$e[1];

            return (void 0 === s || t >= s - r) && (void 0 === o || t <= o + r);
          });
        }
      }
    }, {
      key: "chromaticAdaptation",
      value: function chromaticAdaptation(e, r, a) {
        var s = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        if ((e = e || h.whites.D50) === (r = r || h.whites.D50)) return a;
        var o = {
          W1: e,
          W2: r,
          XYZ: a,
          options: s
        };
        if (h.hooks.run("chromatic-adaptation-start", o), o.M || (o.W1 === h.whites.D65 && o.W2 === h.whites.D50 ? o.M = [[1.0479298208405488, .022946793341019088, -.05019222954313557], [.029627815688159344, .990434484573249, -.01707382502938514], [-.009243058152591178, .015055144896577895, .7518742899580008]] : o.W1 === h.whites.D50 && o.W2 === h.whites.D65 && (o.M = [[.9554734527042182, -.023098536874261423, .0632593086610217], [-.028369706963208136, 1.0099954580058226, .021041398966943008], [.012314001688319899, -.020507696433477912, 1.3303659366080753]])), h.hooks.run("chromatic-adaptation-end", o), o.M) return t(o.M, o.XYZ);
        throw new TypeError("Only Bradford CAT with white points D50 and D65 supported for now.");
      }
    }, {
      key: "parse",
      value: function parse(t) {
        var e = {
          str: t
        };
        if (h.hooks.run("parse-start", e), e.color) return e.color;
        if (e.parsed = h.parseFunction(e.str), h.hooks.run("parse-function-start", e), e.color) return e.color;

        for (var _i4 = 0, _Object$values = Object.values(h.spaces); _i4 < _Object$values.length; _i4++) {
          var _t10 = _Object$values[_i4];

          if (_t10.parse) {
            var _r8 = _t10.parse(e.str, e.parsed);

            if (_r8) return _r8;
          }
        }

        var r = e.parsed && e.parsed.name;

        if (!/^color|^rgb/.test(r) && l && document.head) {
          var _a7 = document.head.style.color;

          if (document.head.style.color = "", document.head.style.color = t, document.head.style.color !== _a7) {
            var _s2 = getComputedStyle(document.head).color;
            document.head.style.color = _a7, _s2 && (t = _s2, e.parsed = h.parseFunction(_s2), r = e.parsed.name);
          }
        }

        if (e.parsed) {
          if ("rgb" === r || "rgba" === r) {
            var _t11 = e.parsed.args.map(function (t, e) {
              return e < 3 && !t.percentage ? t / 255 : +t;
            });

            return {
              spaceId: "srgb",
              coords: _t11.slice(0, 3),
              alpha: _t11[3]
            };
          }

          if ("color" === r) {
            var _t12 = e.parsed.args.shift().toLowerCase(),
                _r9 = Object.values(h.spaces).find(function (e) {
              return (e.cssId || e.id) === _t12;
            });

            if (_r9) {
              var _t13 = Object.keys(_r9.coords).length,
                  _a8 = e.parsed.rawArgs.indexOf("/") > 0 ? e.parsed.args.pop() : 1,
                  _s3 = Array(_t13).fill(0);

              return _s3.forEach(function (t, r) {
                return _s3[r] = e.parsed.args[r] || 0;
              }), {
                spaceId: _r9.id,
                coords: _s3,
                alpha: _a8
              };
            }

            throw new TypeError("Color space ".concat(_t12, " not found. Missing a plugin?"));
          }
        }

        throw new TypeError("Could not parse ".concat(t, " as a color. Missing a plugin?"));
      }
    }, {
      key: "parseFunction",
      value: function parseFunction(t) {
        if (!t) return;
        t = t.trim();
        var e = /^-?[\d.]+$/;
        var r = t.match(/^([a-z]+)\((.+?)\)$/i);

        if (r) {
          var _t14 = r[2].match(/([-\w.]+(?:%|deg)?)/g);

          return _t14 = _t14.map(function (t) {
            if (/%$/.test(t)) {
              var _e9 = new Number(+t.slice(0, -1) / 100);

              return _e9.percentage = !0, _e9;
            }

            if (/deg$/.test(t)) {
              var _e10 = new Number(+t.slice(0, -3));

              return _e10.deg = !0, _e10;
            }

            return e.test(t) ? +t : t;
          }), {
            name: r[1].toLowerCase(),
            rawName: r[1],
            rawArgs: r[2],
            args: _t14
          };
        }
      }
    }, {
      key: "convert",
      value: function convert(t, e, r) {
        if ((e = h.space(e)) === (r = h.space(r))) return t;
        t = t.map(function (t) {
          return Number.isNaN(t) ? 0 : t;
        });
        var a = e.id,
            s = r.id;
        if (r.from && r.from[a]) return r.from[a](t);
        if (e.to && e.to[s]) return e.to[s](t);
        var o = e.toXYZ(t);
        return r.white !== e.white && (o = h.chromaticAdaptation(e.white, r.white, o)), r.fromXYZ(o);
      }
    }, {
      key: "get",
      value: function get(t) {
        for (var _len3 = arguments.length, e = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          e[_key3 - 1] = arguments[_key3];
        }

        return t instanceof h ? t : _construct(h, [t].concat(e));
      }
    }, {
      key: "space",
      value: function space(t) {
        var e = r(t);

        if ("string" === e) {
          var _e11 = h.spaces[t.toLowerCase()];
          if (!_e11) throw new TypeError("No color space found with id = \"".concat(t, "\""));
          return _e11;
        }

        if (t && "object" === e) return t;
        throw new TypeError(t + " is not a valid color space");
      }
    }, {
      key: "defineSpace",
      value: function defineSpace(_ref8) {
        var t = _ref8.id,
            e = _ref8.inherits;
        var r = h.spaces[t] = arguments[0];

        if (e) {
          var _t15 = ["id", "parse", "instance", "properties"];
          var _a9 = h.spaces[e];

          for (var _e12 in _a9) {
            _t15.includes(_e12) || _e12 in r || s(r, _a9, _e12);
          }
        }

        var o = r.coords;

        if (r.properties && a(h.prototype, r.properties), !r.fromXYZ && !r.toXYZ) {
          var _t16;

          if (r.from && r.to) {
            var _e13 = new Set(Object.keys(r.from)),
                _a10 = new Set(Object.keys(r.to)),
                _s4 = _toConsumableArray(_e13).filter(function (t) {
              if (_a10.has(t)) {
                var _e14 = h.spaces[t];
                return _e14 && _e14.fromXYZ && _e14.toXYZ;
              }
            });

            _s4.length > 0 && (_t16 = h.spaces[_s4[0]]);
          }

          if (!_t16) throw new ReferenceError("No connection space found for ".concat(r.name, "."));
          Object.assign(r, {
            fromXYZ: function fromXYZ(e) {
              var r = _t16.fromXYZ(e);

              return this.from[_t16.id](r);
            },
            toXYZ: function toXYZ(e) {
              var r = this.to[_t16.id](e);

              return _t16.toXYZ(r);
            }
          });
        }

        var i = Object.keys(o);
        return Object.defineProperty(h.prototype, t, {
          get: function get() {
            var _this = this;

            var e = h.convert(this.coords, this.spaceId, t);
            return "undefined" == typeof Proxy ? e : new Proxy(e, {
              has: function has(t, e) {
                return i.includes(e) || Reflect.has(t, e);
              },
              get: function get(t, e, r) {
                var a = i.indexOf(e);
                return a > -1 ? t[a] : Reflect.get(t, e, r);
              },
              set: function set(e, r, a, s) {
                var o = i.indexOf(r);
                return r > -1 && (o = r), o > -1 ? (e[o] = a, _this.coords = h.convert(e, t, _this.spaceId), !0) : Reflect.set(e, r, a, s);
              }
            });
          },
          set: function set(e) {
            this.coords = h.convert(e, t, this.spaceId);
          },
          configurable: !0,
          enumerable: !0
        }), r;
      }
    }, {
      key: "defineShortcut",
      value: function defineShortcut(t) {
        var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : h.prototype;
        var r = arguments.length > 2 ? arguments[2] : undefined;
        r && (h.shortcuts[t] = r), Object.defineProperty(e, t, {
          get: function get() {
            return n(this, h.shortcuts[t]);
          },
          set: function set(e) {
            return n(this, h.shortcuts[t], e);
          },
          configurable: !0,
          enumerable: !0
        });
      }
    }, {
      key: "statify",
      value: function statify() {

        var _iterator = _createForOfIteratorHelper(Object.getOwnPropertyNames(h.prototype)),
            _step;

        try {
          var _loop = function _loop() {
            var t = _step.value;
            var e = Object.getOwnPropertyDescriptor(h.prototype, t);
            e.get || e.set || "function" != typeof e.value || t in h || (h[t] = function (e) {
              var _e15;

              for (var _len4 = arguments.length, r = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                r[_key4 - 1] = arguments[_key4];
              }

              return (_e15 = e = h.get(e))[t].apply(_e15, r);
            });
          };

          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            _loop();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }]);

    return h;
  }();

  Object.assign(h, {
    util: c,
    hooks: new ( /*#__PURE__*/function () {
      function _class() {
        _classCallCheck(this, _class);
      }

      _createClass(_class, [{
        key: "add",
        value: function add(t, e, r) {
          if ("string" == typeof arguments[0]) (Array.isArray(t) ? t : [t]).forEach(function (t) {
            this[t] = this[t] || [], e && this[t][r ? "unshift" : "push"](e);
          }, this);else for (var t in arguments[0]) {
            this.add(t, arguments[0][t], arguments[1]);
          }
        }
      }, {
        key: "run",
        value: function run(t, e) {
          this[t] = this[t] || [], this[t].forEach(function (t) {
            t.call(e && e.context ? e.context : e, e);
          });
        }
      }]);

      return _class;
    }())(),
    whites: {
      D50: [.3457 / .3585, 1, .2958 / .3585],
      D65: [.3127 / .329, 1, .3583 / .329]
    },
    spaces: {},
    shortcuts: {
      lightness: "lch.lightness",
      chroma: "lch.chroma",
      hue: "lch.hue"
    },
    defaults: {
      gamutMapping: "lch.chroma",
      precision: 5,
      deltaE: "76",
      fallbackSpaces: ["p3", "srgb"]
    }
  }), h.defineSpace({
    id: "xyz",
    name: "XYZ",
    coords: {
      X: [],
      Y: [],
      Z: []
    },
    white: h.whites.D50,
    inGamut: function inGamut(t) {
      return !0;
    },
    toXYZ: function toXYZ(t) {
      return t;
    },
    fromXYZ: function fromXYZ(t) {
      return t;
    }
  });

  for (var _t17 in h.shortcuts) {
    h.defineShortcut(_t17);
  }

  h.statify(), h.defineSpace({
    id: "lab",
    name: "Lab",
    coords: {
      L: [0, 100],
      a: [-100, 100],
      b: [-100, 100]
    },
    inGamut: function inGamut(t) {
      return !0;
    },
    white: h.whites.D50,
    "ε": 216 / 24389,
    "ε3": 24 / 116,
    "κ": 24389 / 27,
    fromXYZ: function fromXYZ(t) {
      var e = this["κ"],
          r = this["ε"],
          a = this.white;
      var s = t.map(function (t, e) {
        return t / a[e];
      }).map(function (t) {
        return t > r ? Math.cbrt(t) : (e * t + 16) / 116;
      });
      return [116 * s[1] - 16, 500 * (s[0] - s[1]), 200 * (s[1] - s[2])];
    },
    toXYZ: function toXYZ(t) {
      var e = this["κ"],
          r = this["ε3"],
          a = this.white;
      var s = [];
      return s[1] = (t[0] + 16) / 116, s[0] = t[1] / 500 + s[1], s[2] = s[1] - t[2] / 200, [s[0] > r ? Math.pow(s[0], 3) : (116 * s[0] - 16) / e, t[0] > 8 ? Math.pow((t[0] + 16) / 116, 3) : t[0] / e, s[2] > r ? Math.pow(s[2], 3) : (116 * s[2] - 16) / e].map(function (t, e) {
        return t * a[e];
      });
    },
    parse: function parse(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : h.parseFunction(t);

      if (e && "lab" === e.name) {
        var _t18 = e.args[0];
        return _t18.percentage && (e.args[0] = 100 * _t18), {
          spaceId: "lab",
          coords: e.args.slice(0, 3),
          alpha: e.args.slice(3)[0]
        };
      }
    },
    instance: {
      toString: function toString() {
        var _ref9 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            t = _ref9.format,
            e = _objectWithoutProperties(_ref9, _excluded2);

        return t || (t = function t(_t19, e) {
          return 0 === e ? _t19 + "%" : _t19;
        }), h.prototype.toString.call(this, _objectSpread2({
          name: "lab",
          format: t
        }, e));
      }
    }
  });
  var p = [0, 360];

  function u(t) {
    return (t % 360 + 360) % 360;
  }

  p.isAngle = !0, h.defineSpace({
    id: "lch",
    name: "LCH",
    coords: {
      lightness: [0, 100],
      chroma: [0, 150],
      hue: p
    },
    inGamut: function inGamut(t) {
      return !0;
    },
    white: h.whites.D50,
    from: {
      lab: function lab(t) {
        var e,
            _t20 = _slicedToArray(t, 3),
            r = _t20[0],
            a = _t20[1],
            s = _t20[2];

        return e = Math.abs(a) < .02 && Math.abs(s) < .02 ? NaN : 180 * Math.atan2(s, a) / Math.PI, [r, Math.sqrt(Math.pow(a, 2) + Math.pow(s, 2)), u(e)];
      }
    },
    to: {
      lab: function lab(t) {
        var _t21 = _slicedToArray(t, 3),
            e = _t21[0],
            r = _t21[1],
            a = _t21[2];

        return r < 0 && (r = 0), isNaN(a) && (a = 0), [e, r * Math.cos(a * Math.PI / 180), r * Math.sin(a * Math.PI / 180)];
      }
    },
    parse: function parse(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : h.parseFunction(t);

      if (e && "lch" === e.name) {
        var _t22 = e.args[0];
        return _t22.percentage && (e.args[0] = 100 * _t22), {
          spaceId: "lch",
          coords: e.args.slice(0, 3),
          alpha: e.args.slice(3)[0]
        };
      }
    },
    instance: {
      toString: function toString() {
        var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            t = _ref10.format,
            e = _objectWithoutProperties(_ref10, _excluded3);

        return t || (t = function t(_t23, e) {
          return 0 === e ? _t23 + "%" : _t23;
        }), h.prototype.toString.call(this, _objectSpread2({
          name: "lch",
          format: t
        }, e));
      }
    }
  }), h.defineSpace({
    id: "srgb",
    name: "sRGB",
    coords: {
      red: [0, 1],
      green: [0, 1],
      blue: [0, 1]
    },
    white: h.whites.D65,
    toLinear: function toLinear(t) {
      return t.map(function (t) {
        var e = t < 0 ? -1 : 1,
            r = Math.abs(t);
        return r < .04045 ? t / 12.92 : e * Math.pow((r + .055) / 1.055, 2.4);
      });
    },
    toGamma: function toGamma(t) {
      return t.map(function (t) {
        var e = t < 0 ? -1 : 1,
            r = Math.abs(t);
        return r > .0031308 ? e * (1.055 * Math.pow(r, 1 / 2.4) - .055) : 12.92 * t;
      });
    },
    toXYZ_M: [[.41239079926595934, .357584339383878, .1804807884018343], [.21263900587151027, .715168678767756, .07219231536073371], [.01933081871559182, .11919477979462598, .9505321522496607]],
    fromXYZ_M: [[3.2409699419045226, -1.537383177570094, -.4986107602930034], [-.9692436362808796, 1.8759675015077202, .04155505740717559], [.05563007969699366, -.20397695888897652, 1.0569715142428786]],
    toXYZ: function toXYZ(e) {
      return e = this.toLinear(e), t(this.toXYZ_M, e);
    },
    fromXYZ: function fromXYZ(e) {
      return this.toGamma(t(this.fromXYZ_M, e));
    },
    properties: {
      toHex: function toHex() {
        var _ref11 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref11$alpha = _ref11.alpha,
            t = _ref11$alpha === void 0 ? !0 : _ref11$alpha,
            _ref11$collapse = _ref11.collapse,
            e = _ref11$collapse === void 0 ? !0 : _ref11$collapse;

        var r = this.to("srgb", {
          inGamut: !0
        }).coords;
        this.alpha < 1 && t && r.push(this.alpha), r = r.map(function (t) {
          return Math.round(255 * t);
        });
        var a = e && r.every(function (t) {
          return t % 17 == 0;
        });
        return "#" + r.map(function (t) {
          return a ? (t / 17).toString(16) : t.toString(16).padStart(2, "0");
        }).join("");
      },

      get hex() {
        return this.toHex();
      }

    },
    instance: {
      toString: function toString() {
        var _ref12 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref12$inGamut = _ref12.inGamut,
            t = _ref12$inGamut === void 0 ? !0 : _ref12$inGamut,
            e = _ref12.commas,
            _ref12$format = _ref12.format,
            r = _ref12$format === void 0 ? "%" : _ref12$format,
            a = _objectWithoutProperties(_ref12, _excluded4);

        if (255 === r) r = function r(t) {
          return 255 * t;
        };else if ("hex" === r) return this.toHex(arguments[0]);
        return h.prototype.toString.call(this, _objectSpread2({
          inGamut: t,
          commas: e,
          format: r,
          name: "rgb" + (e && this.alpha < 1 ? "a" : "")
        }, a));
      }
    },
    parseHex: function parseHex(t) {
      t.length <= 5 && (t = t.replace(/[a-f0-9]/gi, "$&$&"));
      var e = [];
      return t.replace(/[a-f0-9]{2}/gi, function (t) {
        e.push(parseInt(t, 16) / 255);
      }), {
        spaceId: "srgb",
        coords: e.slice(0, 3),
        alpha: e.slice(3)[0]
      };
    }
  }), h.hooks.add("parse-start", function (t) {
    var e = t.str;
    /^#([a-f0-9]{3,4}){1,2}$/i.test(e) && (t.color = h.spaces.srgb.parseHex(e));
  }), h.defineSpace({
    inherits: "srgb",
    id: "srgb-linear",
    name: "sRGB-linear",
    toLinear: function toLinear(t) {
      return t;
    },
    toGamma: function toGamma(t) {
      return t;
    }
  }), h.defineSpace({
    id: "hsl",
    name: "HSL",
    coords: {
      hue: p,
      saturation: [0, 100],
      lightness: [0, 100]
    },
    inGamut: function inGamut(t) {
      var e = this.to.srgb(t);
      return h.inGamut("srgb", e);
    },
    white: h.whites.D65,
    from: {
      srgb: function srgb(t) {
        var e = Math.max.apply(Math, t),
            r = Math.min.apply(Math, t),
            _t24 = _slicedToArray(t, 3),
            a = _t24[0],
            s = _t24[1],
            o = _t24[2],
            i = NaN,
            n = 0,
            c = (r + e) / 2,
            l = e - r;

        if (0 !== l) {
          switch (n = 0 === c || 1 === c ? 0 : (e - c) / Math.min(c, 1 - c), e) {
            case a:
              i = (s - o) / l + (s < o ? 6 : 0);
              break;

            case s:
              i = (o - a) / l + 2;
              break;

            case o:
              i = (a - s) / l + 4;
          }

          i *= 60;
        }

        return [i, 100 * n, 100 * c];
      }
    },
    to: {
      srgb: function srgb(t) {
        var _t25 = _slicedToArray(t, 3),
            e = _t25[0],
            r = _t25[1],
            a = _t25[2];

        function s(t) {
          var s = (t + e / 30) % 12,
              o = r * Math.min(a, 1 - a);
          return a - o * Math.max(-1, Math.min(s - 3, 9 - s, 1));
        }

        return e %= 360, e < 0 && (e += 360), r /= 100, a /= 100, [s(0), s(8), s(4)];
      }
    },
    parse: function parse(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : h.parseFunction(t);

      if (e && /^hsla?$/.test(e.name)) {
        var _t26 = e.args;
        return _t26[1] *= 100, _t26[2] *= 100, {
          spaceId: "hsl",
          coords: _t26.slice(0, 3),
          alpha: _t26[3]
        };
      }
    },
    instance: {
      toString: function toString() {
        var _ref13 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            _ref13.precision;
            var e = _ref13.commas,
            r = _ref13.format;
            _ref13.inGamut;
            var s = _objectWithoutProperties(_ref13, _excluded5);

        return r || (r = function r(t, e) {
          return e > 0 ? t + "%" : t;
        }), h.prototype.toString.call(this, _objectSpread2({
          inGamut: !0,
          commas: e,
          format: r,
          name: "hsl" + (e && this.alpha < 1 ? "a" : "")
        }, s));
      }
    }
  }), h.defineSpace({
    id: "hwb",
    name: "HWB",
    coords: {
      hue: p,
      whiteness: [0, 100],
      blackness: [0, 100]
    },
    inGamut: function inGamut(t) {
      var e = this.to.srgb(t);
      return h.inGamut("srgb", e);
    },
    white: h.whites.D65,
    from: {
      srgb: function srgb(t) {
        var e = h.spaces.hsl.from.srgb(t)[0],
            r = Math.min.apply(Math, _toConsumableArray(t)),
            a = 1 - Math.max.apply(Math, _toConsumableArray(t));
        return r *= 100, a *= 100, [e, r, a];
      },
      hsv: function hsv(t) {
        var _t27 = _slicedToArray(t, 3),
            e = _t27[0],
            r = _t27[1],
            a = _t27[2];

        return [e, a * (100 - r) / 100, 100 - a];
      },
      hsl: function hsl(t) {
        var e = h.spaces.hsv.from.hsl(t);
        return this.hsv(e);
      }
    },
    to: {
      srgb: function srgb(t) {
        var _t28 = _slicedToArray(t, 3),
            e = _t28[0],
            r = _t28[1],
            a = _t28[2];

        r /= 100, a /= 100;
        var s = r + a;

        if (s >= 1) {
          var _t29 = r / s;

          return [_t29, _t29, _t29];
        }

        var o = h.spaces.hsl.to.srgb([e, 100, 50]);

        for (var i = 0; i < 3; i++) {
          o[i] *= 1 - r - a, o[i] += r;
        }

        return o;
      },
      hsv: function hsv(t) {
        var _t30 = _slicedToArray(t, 3),
            e = _t30[0],
            r = _t30[1],
            a = _t30[2];

        r /= 100, a /= 100;
        var s = r + a;
        if (s >= 1) return [e, 0, r / s * 100];
        var o = 1 - a;
        return [e, 100 * (0 === o ? 0 : 1 - r / o), 100 * o];
      },
      hsl: function hsl(t) {
        var e = h.spaces.hwb.to.hsv(t);
        return h.spaces.hsv.to.hsl(e);
      }
    },
    parse: function parse(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : h.parseFunction(t);

      if (e && /^hwba?$/.test(e.name)) {
        var _t31 = e.args;
        return _t31[1] *= 100, _t31[2] *= 100, {
          spaceId: "hwb",
          coords: _t31.slice(0, 3),
          alpha: _t31[3]
        };
      }
    },
    instance: {
      toString: function toString() {
        var _ref14 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            t = _ref14.format;
            _ref14.commas;
            _ref14.inGamut;
            var a = _objectWithoutProperties(_ref14, _excluded6);

        return t || (t = function t(_t32, e) {
          return e > 0 ? _t32 + "%" : _t32;
        }), h.prototype.toString.call(this, _objectSpread2({
          inGamut: !0,
          commas: !1,
          format: t,
          name: "hwb"
        }, a));
      }
    }
  }), h.defineSpace({
    id: "hsv",
    name: "HSV",
    coords: {
      hue: p,
      saturation: [0, 100],
      value: [0, 100]
    },
    inGamut: function inGamut(t) {
      var e = this.to.hsl(t);
      return h.spaces.hsl.inGamut(e);
    },
    white: h.whites.D65,
    from: {
      hsl: function hsl(t) {
        var _t33 = _slicedToArray(t, 3),
            e = _t33[0],
            r = _t33[1],
            a = _t33[2];

        r /= 100, a /= 100;
        var s = a + r * Math.min(a, 1 - a);
        return [e, 0 === s ? 0 : 200 * (1 - a / s), 100 * s];
      }
    },
    to: {
      hsl: function hsl(t) {
        var _t34 = _slicedToArray(t, 3),
            e = _t34[0],
            r = _t34[1],
            a = _t34[2];

        r /= 100, a /= 100;
        var s = a * (1 - r / 2);
        return [e, 0 === s || 1 === s ? 0 : (a - s) / Math.min(s, 1 - s) * 100, 100 * s];
      }
    }
  }), h.defineSpace({
    inherits: "srgb",
    id: "p3",
    name: "P3",
    cssId: "display-p3",
    toXYZ_M: [[.4865709486482162, .26566769316909306, .1982172852343625], [.2289745640697488, .6917385218365064, .079286914093745], [0, .04511338185890264, 1.043944368900976]],
    fromXYZ_M: [[2.493496911941425, -.9313836179191239, -.40271078445071684], [-.8294889695615747, 1.7626640603183463, .023624685841943577], [.03584583024378447, -.07617238926804182, .9568845240076872]]
  }), h.defineSpace({
    inherits: "srgb",
    id: "a98rgb",
    name: "Adobe 98 RGB compatible",
    cssId: "a98-rgb",
    toLinear: function toLinear(t) {
      return t.map(function (t) {
        return Math.pow(Math.abs(t), 563 / 256) * Math.sign(t);
      });
    },
    toGamma: function toGamma(t) {
      return t.map(function (t) {
        return Math.pow(Math.abs(t), 256 / 563) * Math.sign(t);
      });
    },
    toXYZ_M: [[.5766690429101305, .1855582379065463, .1882286462349947], [.29734497525053605, .6273635662554661, .07529145849399788], [.02703136138641234, .07068885253582723, .9913375368376388]],
    fromXYZ_M: [[2.0415879038107465, -.5650069742788596, -.34473135077832956], [-.9692436362808795, 1.8759675015077202, .04155505740717557], [.013444280632031142, -.11836239223101838, 1.0151749943912054]]
  }), h.defineSpace({
    inherits: "srgb",
    id: "prophoto",
    name: "ProPhoto",
    cssId: "prophoto-rgb",
    white: h.whites.D50,
    toLinear: function toLinear(t) {
      return t.map(function (t) {
        return t <= 16 / 512 ? t / 16 : Math.pow(t, 1.8);
      });
    },
    toGamma: function toGamma(t) {
      return t.map(function (t) {
        return t >= 1 / 512 ? Math.pow(t, 1 / 1.8) : 16 * t;
      });
    },
    toXYZ_M: [[.7977604896723027, .13518583717574031, .0313493495815248], [.2880711282292934, .7118432178101014, 8565396060525902e-20], [0, 0, .8251046025104601]],
    fromXYZ_M: [[1.3457989731028281, -.25558010007997534, -.05110628506753401], [-.5446224939028347, 1.5082327413132781, .02053603239147973], [0, 0, 1.2119675456389454]]
  }), h.defineSpace({
    inherits: "srgb",
    id: "rec2020",
    name: "REC.2020",
    "α": 1.09929682680944,
    "β": .018053968510807,
    toLinear: function toLinear(t) {
      var e = this["α"],
          r = this["β"];
      return t.map(function (t) {
        return t < 4.5 * r ? t / 4.5 : Math.pow((t + e - 1) / e, 1 / .45);
      });
    },
    toGamma: function toGamma(t) {
      var e = this["α"],
          r = this["β"];
      return t.map(function (t) {
        return t > r ? e * Math.pow(t, .45) - (e - 1) : 4.5 * t;
      });
    },
    toXYZ_M: [[.6369580483012914, .14461690358620832, .1688809751641721], [.2627002120112671, .6779980715188708, .05930171646986196], [0, .028072693049087428, 1.060985057710791]],
    fromXYZ_M: [[1.716651187971268, -.355670783776392, -.25336628137366], [-.666684351832489, 1.616481236634939, .0157685458139111], [.017639857445311, -.042770613257809, .942103121235474]]
  }), h.defineSpace({
    id: "absxyzd65",
    name: "Absolute XYZ D65",
    coords: {
      Xa: [0, 9504.7],
      Ya: [0, 1e4],
      Za: [0, 10888.3]
    },
    white: h.whites.D65,
    Yw: 203,
    inGamut: function inGamut(t) {
      return !0;
    },
    fromXYZ: function fromXYZ(t) {
      var e = this.Yw;
      return t.map(function (t) {
        return Math.max(t * e, 0);
      });
    },
    toXYZ: function toXYZ(t) {
      var e = this.Yw;
      return t.map(function (t) {
        return Math.max(t / e, 0);
      });
    }
  }), h.defineSpace({
    id: "jzazbz",
    cssid: "Jzazbz",
    name: "Jzazbz",
    coords: {
      Jz: [0, 1],
      az: [-.5, .5],
      bz: [-.5, .5]
    },
    inGamut: function inGamut(t) {
      return !0;
    },
    white: h.whites.D65,
    b: 1.15,
    g: .66,
    n: 2610 / 16384,
    ninv: 16384 / 2610,
    c1: .8359375,
    c2: 2413 / 128,
    c3: 18.6875,
    p: 1.7 * 2523 / 32,
    pinv: 32 / (1.7 * 2523),
    d: -.56,
    d0: 16295499532821565e-27,
    XYZtoCone_M: [[.41478972, .579999, .014648], [-.20151, 1.120649, .0531008], [-.0166008, .2648, .6684799]],
    ConetoXYZ_M: [[1.9242264357876067, -1.0047923125953657, .037651404030618], [.35031676209499907, .7264811939316552, -.06538442294808501], [-.09098281098284752, -.3127282905230739, 1.5227665613052603]],
    ConetoIab_M: [[.5, .5, 0], [3.524, -4.066708, .542708], [.199076, 1.096799, -1.295875]],
    IabtoCone_M: [[1, .1386050432715393, .05804731615611886], [.9999999999999999, -.1386050432715393, -.05804731615611886], [.9999999999999998, -.09601924202631895, -.8118918960560388]],
    fromXYZ: function fromXYZ(e) {
      var r = this.b,
          a = this.g,
          s = this.n,
          o = this.p,
          i = this.c1,
          n = this.c2,
          c = this.c3,
          l = this.d,
          p = this.d0,
          u = this.XYZtoCone_M,
          d = this.ConetoIab_M;

      var _h$spaces$absxyzd65$f = h.spaces.absxyzd65.fromXYZ(e),
          _h$spaces$absxyzd65$f2 = _slicedToArray(_h$spaces$absxyzd65$f, 3),
          m = _h$spaces$absxyzd65$f2[0],
          f = _h$spaces$absxyzd65$f2[1],
          g = _h$spaces$absxyzd65$f2[2],
          M = t(u, [r * m - (r - 1) * g, a * f - (a - 1) * m, g]).map(function (t) {
        return Math.pow((i + n * Math.pow(t / 1e4, s)) / (1 + c * Math.pow(t / 1e4, s)), o);
      }),
          _t35 = t(d, M),
          _t36 = _slicedToArray(_t35, 3),
          b = _t36[0],
          w = _t36[1],
          y = _t36[2];

      return [(1 + l) * b / (1 + l * b) - p, w, y];
    },
    toXYZ: function toXYZ(e) {
      var r = this.b,
          a = this.g,
          s = this.ninv,
          o = this.pinv,
          i = this.c1,
          n = this.c2,
          c = this.c3,
          l = this.d,
          p = this.d0,
          u = this.ConetoXYZ_M,
          d = this.IabtoCone_M;

      var _e16 = _slicedToArray(e, 3),
          m = _e16[0],
          f = _e16[1],
          g = _e16[2],
          M = t(d, [(m + p) / (1 + l - l * (m + p)), f, g]).map(function (t) {
        return 1e4 * Math.pow((i - Math.pow(t, o)) / (c * Math.pow(t, o) - n), s);
      }),
          _t37 = t(u, M),
          _t38 = _slicedToArray(_t37, 3),
          b = _t38[0],
          w = _t38[1],
          y = _t38[2],
          S = (b + (r - 1) * y) / r,
          C = (w + (a - 1) * S) / a;

      return h.spaces.absxyzd65.toXYZ([S, C, y]);
    },
    parse: function parse(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : h.parseFunction(t);
      if (e && "jzabz" === e.name) return {
        spaceId: "jzazbz",
        coords: e.args.slice(0, 3),
        alpha: e.args.slice(3)[0]
      };
    },
    instance: {
      toString: function toString() {
        var _ref15 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            t = _ref15.format,
            e = _objectWithoutProperties(_ref15, _excluded7);

        return h.prototype.toString.call(this, _objectSpread2({
          name: "jzazbz",
          format: t
        }, e));
      }
    }
  }), h.defineSpace({
    id: "jzczhz",
    name: "JzCzHz",
    coords: {
      Jz: [0, 1],
      chroma: [0, 1],
      hue: p
    },
    inGamut: function inGamut(t) {
      return !0;
    },
    white: h.whites.D65,
    from: {
      jzazbz: function jzazbz(t) {
        var e,
            _t39 = _slicedToArray(t, 3),
            r = _t39[0],
            a = _t39[1],
            s = _t39[2];

        var o = 2e-4;
        return e = Math.abs(a) < o && Math.abs(s) < o ? NaN : 180 * Math.atan2(s, a) / Math.PI, [r, Math.sqrt(Math.pow(a, 2) + Math.pow(s, 2)), u(e)];
      }
    },
    to: {
      jzazbz: function jzazbz(t) {
        return [t[0], t[1] * Math.cos(t[2] * Math.PI / 180), t[1] * Math.sin(t[2] * Math.PI / 180)];
      }
    },
    parse: function parse(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : h.parseFunction(t);
      if (e && "jzczhz" === e.name) return e.args[0], {
        spaceId: "jzczhz",
        coords: e.args.slice(0, 3),
        alpha: e.args.slice(3)[0]
      };
    }
  }), h.spaces.rec2020, h.defineSpace({
    id: "ictcp",
    name: "ICTCP",
    coords: {
      I: [0, 1],
      CT: [-.5, .5],
      CP: [-.5, .5]
    },
    inGamut: function inGamut(t) {
      return !0;
    },
    white: h.whites.D65,
    c1: .8359375,
    c2: 2413 / 128,
    c3: 18.6875,
    m1: 2610 / 16384,
    m2: 2523 / 32,
    im1: 16384 / 2610,
    im2: 32 / 2523,
    XYZtoLMS_M: [[.3592, .6976, -.0358], [-.1922, 1.1004, .0755], [.007, .0749, .8434]],
    Rec2020toLMS_M: [[1688 / 4096, 2146 / 4096, 262 / 4096], [683 / 4096, 2951 / 4096, 462 / 4096], [99 / 4096, 309 / 4096, 3688 / 4096]],
    LMStoIPT_M: [[.5, .5, 0], [6610 / 4096, -13613 / 4096, 7003 / 4096], [17933 / 4096, -17390 / 4096, -543 / 4096]],
    IPTtoLMS_M: [[.9999888965628402, .008605050147287059, .11103437159861648], [1.00001110343716, -.008605050147287059, -.11103437159861648], [1.0000320633910054, .56004913547279, -.3206339100541203]],
    LMStoRec2020_M: [[3.437556893281401, -2.507211212509506, .06965431922810461], [-.7914286866564416, 1.983837219874009, -.19240853321756743], [-.025646662911506475, -.09924024864394557, 1.124886911555452]],
    LMStoXYZ_M: [[2.0701800566956137, -1.326456876103021, .20661600684785517], [.3649882500326575, .6804673628522352, -.04542175307585323], [-.04959554223893211, -.04942116118675749, 1.1879959417328034]],
    fromXYZ: function fromXYZ(e) {
      var r = this.XYZtoLMS_M;

      var _h$spaces$absxyzd65$f3 = h.spaces.absxyzd65.fromXYZ(e),
          _h$spaces$absxyzd65$f4 = _slicedToArray(_h$spaces$absxyzd65$f3, 3),
          a = _h$spaces$absxyzd65$f4[0],
          s = _h$spaces$absxyzd65$f4[1],
          o = _h$spaces$absxyzd65$f4[2],
          i = t(r, [a, s, o]);

      return this.LMStoICtCp(i);
    },
    toXYZ: function toXYZ(e) {
      var r = this.LMStoXYZ_M;
      var a = t(r, this.ICtCptoLMS(e));
      return h.spaces.absxyzd65.toXYZ(a);
    },
    LMStoICtCp: function LMStoICtCp(e) {
      var r = this.LMStoIPT_M,
          a = this.c1,
          s = this.c2,
          o = this.c3,
          i = this.m1,
          n = this.m2;
      return t(r, e.map(function (t) {
        return Math.pow((a + s * Math.pow(t / 1e4, i)) / (1 + o * Math.pow(t / 1e4, i)), n);
      }));
    },
    ICtCptoLMS: function ICtCptoLMS(e) {
      var r = this.IPTtoLMS_M,
          a = this.c1,
          s = this.c2,
          o = this.c3,
          i = this.im1,
          n = this.im2;
      return t(r, e).map(function (t) {
        return 1e4 * Math.pow(Math.max(Math.pow(t, n) - a, 0) / (s - o * Math.pow(t, n)), i);
      });
    }
  }), h.defineSpace({
    inherits: "rec2020",
    id: "rec2100pq",
    cssid: "rec2100-pq",
    name: "REC.2100-PQ",
    Yw: 203,
    n: 2610 / 16384,
    ninv: 16384 / 2610,
    m: 2523 / 32,
    minv: 32 / 2523,
    c1: .8359375,
    c2: 2413 / 128,
    c3: 18.6875,
    toLinear: function toLinear(t) {
      var e = this.Yw,
          r = this.ninv,
          a = this.minv,
          s = this.c1,
          o = this.c2,
          i = this.c3;
      return t.map(function (t) {
        return 1e4 * Math.pow(Math.max(Math.pow(t, a) - s, 0) / (o - i * Math.pow(t, a)), r) / e;
      });
    },
    toGamma: function toGamma(t) {
      var e = this.Yw,
          r = this.n,
          a = this.m,
          s = this.c1,
          o = this.c2,
          i = this.c3;
      return t.map(function (t) {
        var n = Math.max(t * e / 1e4, 0);
        return Math.pow((s + o * Math.pow(n, r)) / (1 + i * Math.pow(n, r)), a);
      });
    }
  }), h.defineSpace({
    id: "oklab",
    cssid: "oklab",
    name: "OKLab",
    coords: {
      L: [0, 1],
      a: [-.5, .5],
      b: [-.5, .5]
    },
    inGamut: function inGamut(t) {
      return !0;
    },
    white: h.whites.D65,
    XYZtoLMS_M: [[.8189330101, .3618667424, -.1288597137], [.0329845436, .9293118715, .0361456387], [.0482003018, .2643662691, .633851707]],
    LMStoXYZ_M: [[1.2270138511035211, -.5577999806518222, .28125614896646783], [-.04058017842328059, 1.11225686961683, -.0716766786656012], [-.07638128450570689, -.4214819784180127, 1.5861632204407947]],
    LMStoLab_M: [[.2104542553, .793617785, -.0040720468], [1.9779984951, -2.428592205, .4505937099], [.0259040371, .7827717662, -.808675766]],
    LabtoLMS_M: [[.9999999984505198, .39633779217376786, .2158037580607588], [1.0000000088817609, -.10556134232365635, -.06385417477170591], [1.0000000546724108, -.08948418209496575, -1.2914855378640917]],
    fromXYZ: function fromXYZ(e) {
      var r = this.XYZtoLMS_M,
          a = this.LMStoLab_M;
      var s = t(r, e);
      return t(a, s.map(function (t) {
        return Math.cbrt(t);
      }));
    },
    toXYZ: function toXYZ(e) {
      var r = this.LMStoXYZ_M,
          a = this.LabtoLMS_M;
      var s = t(a, e);
      return t(r, s.map(function (t) {
        return Math.pow(t, 3);
      }));
    }
  }), h.defineSpace({
    id: "oklch",
    name: "OKLCh",
    coords: {
      lightness: [0, 1],
      chroma: [0, 1],
      hue: p
    },
    inGamut: function inGamut(t) {
      return !0;
    },
    white: h.whites.D65,
    from: {
      oklab: function oklab(t) {
        var e,
            _t40 = _slicedToArray(t, 3),
            r = _t40[0],
            a = _t40[1],
            s = _t40[2];

        var o = 2e-4;
        return e = Math.abs(a) < o && Math.abs(s) < o ? NaN : 180 * Math.atan2(s, a) / Math.PI, [r, Math.sqrt(Math.pow(a, 2) + Math.pow(s, 2)), u(e)];
      }
    },
    to: {
      oklab: function oklab(t) {
        var e,
            r,
            _t41 = _slicedToArray(t, 3),
            a = _t41[0],
            s = _t41[1],
            o = _t41[2];

        return isNaN(o) ? (e = 0, r = 0) : (e = s * Math.cos(o * Math.PI / 180), r = s * Math.sin(o * Math.PI / 180)), [a, e, r];
      }
    },
    parse: function parse(t) {
      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : h.parseFunction(t);
      if (e && "oklch" === e.name) return e.args[0], {
        spaceId: "oklch",
        coords: e.args.slice(0, 3),
        alpha: e.args.slice(3)[0]
      };
    }
  }), h.CATs = {}, h.hooks.add("chromatic-adaptation-start", function (t) {
    t.options.method && (t.M = h.adapt(t.W1, t.W2, t.options.method));
  }), h.hooks.add("chromatic-adaptation-end", function (t) {
    t.M || (t.M = h.adapt(t.W1, t.W2, t.options.method));
  }), h.defineCAT = function (_ref16) {
    var t = _ref16.id;
        _ref16.toCone_M;
        _ref16.fromCone_M;
    h.CATs[t] = arguments[0];
  }, h.adapt = function (e, r) {
    var a = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Bradford";

    var s = h.CATs[a],
        _t42 = t(s.toCone_M, e),
        _t43 = _slicedToArray(_t42, 3),
        o = _t43[0],
        i = _t43[1],
        n = _t43[2],
        _t44 = t(s.toCone_M, r),
        _t45 = _slicedToArray(_t44, 3),
        c = _t45[0],
        l = _t45[1],
        p = _t45[2],
        u = t([[c / o, 0, 0], [0, l / i, 0], [0, 0, p / n]], s.toCone_M);

    return t(s.fromCone_M, u);
  }, h.defineCAT({
    id: "von Kries",
    toCone_M: [[.40024, .7076, -.08081], [-.2263, 1.16532, .0457], [0, 0, .91822]],
    fromCone_M: [[1.8599364, -1.1293816, .2198974], [.3611914, .6388125, -64e-7], [0, 0, 1.0890636]]
  }), h.defineCAT({
    id: "Bradford",
    toCone_M: [[.8951, .2664, -.1614], [-.7502, 1.7135, .0367], [.0389, -.0685, 1.0296]],
    fromCone_M: [[.9869929, -.1470543, .1599627], [.4323053, .5183603, .0492912], [-.0085287, .0400428, .9684867]]
  }), h.defineCAT({
    id: "CAT02",
    toCone_M: [[.7328, .4296, -.1624], [-.7036, 1.6975, .0061], [.003, .0136, .9834]],
    fromCone_M: [[1.0961238, -.278869, .1827452], [.454369, .4735332, .0720978], [-.0096276, -.005698, 1.0153256]]
  }), h.defineCAT({
    id: "CAT16",
    toCone_M: [[.401288, .650173, -.051461], [-.250268, 1.204414, .045854], [-.002079, .048952, .953127]],
    fromCone_M: [[1.862067855087233, -1.011254630531685, .1491867754444518], [.3875265432361372, .6214474419314753, -.008973985167612518], [-.01584149884933386, -.03412293802851557, 1.04996443687785]]
  }), Object.assign(h.whites, {
    A: [1.0985, 1, .35585],
    C: [.98074, 1, 1.18232],
    D55: [.95682, 1, .92149],
    D75: [.94972, 1, 1.22638],
    E: [1, 1, 1],
    F2: [.99186, 1, .67393],
    F7: [.95041, 1, 1.08747],
    F11: [1.00962, 1, .6435]
  }), h.defineSpace({
    id: "acescc",
    name: "ACEScc",
    inherits: "srgb",
    coords: {
      red: [-.3014, 1.468],
      green: [-.3014, 1.468],
      blue: [-.3014, 1.468]
    },
    white: h.whites.ACES = [.32168 / .33767, 1, .34065 / .33767],
    toLinear: function toLinear(t) {
      var e = (Math.log2(65504) + 9.72) / 17.52;
      return t.map(function (t) {
        return t <= (9.72 - 15) / 17.52 ? 2 * (Math.pow(2, 17.52 * t - 9.72) - Math.pow(2, -16)) : t < e ? Math.pow(2, 17.52 * t - 9.72) : 65504;
      });
    },
    toGamma: function toGamma(t) {
      var e = Math.pow(2, -16);
      return t.map(function (t) {
        return t <= 0 ? (Math.log2(e) + 9.72) / 17.52 : t < e ? (Math.log2(e + .5 * t) + 9.72) / 17.52 : (Math.log2(t) + 9.72) / 17.52;
      });
    },
    toXYZ_M: [[.6624541811085053, .13400420645643313, .1561876870049078], [.27222871678091454, .6740817658111484, .05368951740793705], [-.005574649490394108, .004060733528982826, 1.0103391003129971]],
    fromXYZ_M: [[1.6410233796943257, -.32480329418479, -.23642469523761225], [-.6636628587229829, 1.6153315916573379, .016756347685530137], [.011721894328375376, -.008284441996237409, .9883948585390215]]
  });
  var d = {
    range: function range() {
      for (var _len5 = arguments.length, t = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        t[_key5] = arguments[_key5];
      }

      return h.range.apply(h, [this].concat(t));
    },
    mix: function mix(t) {
      var _ref17;

      var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : .5;
      var a = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      "object" === r(e) && (_ref17 = [.5, e], e = _ref17[0], a = _ref17[1], _ref17);
      var _a11 = a,
          s = _a11.space,
          o = _a11.outputSpace;
      return t = h.get(t), this.range(t, {
        space: s,
        outputSpace: o
      })(e);
    },
    steps: function steps() {
      for (var _len6 = arguments.length, t = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        t[_key6] = arguments[_key6];
      }

      return h.steps.apply(h, [this].concat(t));
    }
  };

  function m(t) {
    return "function" === r(t) && t.rangeArgs;
  }

  function f(t, e, r) {
    return isNaN(t) ? e : isNaN(e) ? t : t + (e - t) * r;
  }

  h.steps = function (t, e) {
    var _ref18, _a$rangeArgs$colors, _a$rangeArgs$colors2;

    var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var a;
    m(t) && ((_ref18 = [t, e], a = _ref18[0], r = _ref18[1], _ref18), (_a$rangeArgs$colors = a.rangeArgs.colors, _a$rangeArgs$colors2 = _slicedToArray(_a$rangeArgs$colors, 2), t = _a$rangeArgs$colors2[0], e = _a$rangeArgs$colors2[1], _a$rangeArgs$colors));

    var _r10 = r,
        s = _r10.maxDeltaE,
        o = _r10.deltaEMethod,
        _r10$steps = _r10.steps,
        i = _r10$steps === void 0 ? 2 : _r10$steps,
        _r10$maxSteps = _r10.maxSteps,
        n = _r10$maxSteps === void 0 ? 1e3 : _r10$maxSteps,
        c = _objectWithoutProperties(_r10, _excluded8);

    a || (t = h.get(t), e = h.get(e), a = h.range(t, e, c));
    var l = this.deltaE(e),
        p = s > 0 ? Math.max(i, Math.ceil(l / s) + 1) : i,
        u = [];
    if (void 0 !== n && (p = Math.min(p, n)), 1 === p) u = [{
      p: .5,
      color: a(.5)
    }];else {
      var _t46 = 1 / (p - 1);

      u = Array.from({
        length: p
      }, function (e, r) {
        var s = r * _t46;
        return {
          p: s,
          color: a(s)
        };
      });
    }

    if (s > 0) {
      var _t47 = u.reduce(function (t, e, r) {
        if (0 === r) return 0;
        var a = e.color.deltaE(u[r - 1].color, o);
        return Math.max(t, a);
      }, 0);

      for (; _t47 > s;) {
        _t47 = 0;

        for (var _e17 = 1; _e17 < u.length && u.length < n; _e17++) {
          var _r11 = u[_e17 - 1],
              _s5 = u[_e17],
              _o2 = (_s5.p + _r11.p) / 2,
              _i5 = a(_o2);

          _t47 = Math.max(_t47, _i5.deltaE(_r11.color), _i5.deltaE(_s5.color)), u.splice(_e17, 0, {
            p: _o2,
            color: a(_o2)
          }), _e17++;
        }
      }
    }

    return u = u.map(function (t) {
      return t.color;
    }), u;
  }, h.range = function (t, e) {
    var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (m(t)) {
      var _r12 = t,
          _a12 = e;
      return h.range.apply(h, _toConsumableArray(_r12.rangeArgs.colors).concat([_objectSpread2(_objectSpread2({}, _r12.rangeArgs.options), _a12)]));
    }

    var a = r.space,
        s = r.outputSpace,
        o = r.progression,
        i = r.premultiplied;
    t = new h(t), e = new h(e);
    var n = {
      colors: [t, e],
      options: r
    };

    if (a = a ? h.space(a) : h.spaces[h.defaults.interpolationSpace] || t.space, s = s ? h.space(s) : t.space || a, t = t.to(a).toGamut(), e = e.to(a).toGamut(), a.coords.hue && a.coords.hue.isAngle) {
      var _s6 = r.hue = r.hue || "shorter";

      var _ref19 = function (t, e) {
        if ("raw" === t) return e;

        var _e$map = e.map(u),
            _e$map2 = _slicedToArray(_e$map, 2),
            r = _e$map2[0],
            a = _e$map2[1],
            s = a - r;

        return "increasing" === t ? s < 0 && (a += 360) : "decreasing" === t ? s > 0 && (r += 360) : "longer" === t ? -180 < s && s < 180 && (s > 0 ? a += 360 : r += 360) : "shorter" === t && (s > 180 ? r += 360 : s < -180 && (a += 360)), [r, a];
      }(_s6, [t[a.id].hue, e[a.id].hue]);

      var _ref20 = _slicedToArray(_ref19, 2);

      t[a.id].hue = _ref20[0];
      e[a.id].hue = _ref20[1];
    }

    return i && (t.coords = t.coords.map(function (e) {
      return e * t.alpha;
    }), e.coords = e.coords.map(function (t) {
      return t * e.alpha;
    })), Object.assign(function (r) {
      r = o ? o(r) : r;
      var n = t.coords.map(function (t, a) {
        return f(t, e.coords[a], r);
      }),
          c = f(t.alpha, e.alpha, r),
          l = new h(a, n, c);
      return i && (l.coords = l.coords.map(function (t) {
        return t / c;
      })), s !== a && (l = l.to(s)), l;
    }, {
      rangeArgs: n
    });
  }, Object.assign(h.defaults, {
    interpolationSpace: "lab"
  }), Object.assign(h.prototype, d), h.statify(Object.keys(d)), h.prototype.deltaECMC = function (t) {
    var _ref21 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref21$l = _ref21.l,
        e = _ref21$l === void 0 ? 2 : _ref21$l,
        _ref21$c = _ref21.c,
        r = _ref21$c === void 0 ? 1 : _ref21$c;

    t = h.get(t);

    var _this$lab = _slicedToArray(this.lab, 3),
        a = _this$lab[0],
        s = _this$lab[1],
        o = _this$lab[2],
        i = this.chroma,
        n = this.hue,
        _t$lab = _slicedToArray(t.lab, 3),
        c = _t$lab[0],
        l = _t$lab[1],
        p = _t$lab[2],
        u = t.chroma;

    i < 0 && (i = 0), u < 0 && (u = 0);
    var d = a - c,
        m = i - u,
        f = s - l,
        g = o - p;
    var M = Math.PI / 180;
    var b = Math.pow(f, 2) + Math.pow(g, 2) - Math.pow(m, 2),
        w = .511;
    a >= 16 && (w = .040975 * a / (1 + .01765 * a));
    var y,
        S = .0638 * i / (1 + .0131 * i) + .638;
    Number.isNaN(n) && (n = 0), y = n >= 164 && n <= 345 ? .56 + Math.abs(.2 * Math.cos((n + 168) * M)) : .36 + Math.abs(.4 * Math.cos((n + 35) * M));
    var C = Math.pow(i, 4),
        k = Math.sqrt(C / (C + 1900)),
        Y = Math.pow(d / (e * w), 2);
    return Y += Math.pow(m / (r * S), 2), Y += b / Math.pow(S * (k * y + 1 - k), 2), Math.sqrt(Y);
  }, h.statify(["deltaECMC"]), h.prototype.deltaE2000 = function (t) {
    var _ref22 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref22$kL = _ref22.kL,
        e = _ref22$kL === void 0 ? 1 : _ref22$kL,
        _ref22$kC = _ref22.kC,
        r = _ref22$kC === void 0 ? 1 : _ref22$kC,
        _ref22$kH = _ref22.kH,
        a = _ref22$kH === void 0 ? 1 : _ref22$kH;

    t = h.get(t);

    var _this$lab2 = _slicedToArray(this.lab, 3),
        s = _this$lab2[0],
        o = _this$lab2[1],
        i = _this$lab2[2],
        n = this.chroma,
        _t$lab2 = _slicedToArray(t.lab, 3),
        c = _t$lab2[0],
        l = _t$lab2[1],
        p = _t$lab2[2],
        u = t.chroma;

    n < 0 && (n = 0), u < 0 && (u = 0);
    var d = (n + u) / 2,
        m = Math.pow(d, 7);
    var f = Math.pow(25, 7);
    var g = .5 * (1 - Math.sqrt(m / (m + f))),
        M = (1 + g) * o,
        b = (1 + g) * l,
        w = Math.sqrt(Math.pow(M, 2) + Math.pow(i, 2)),
        y = Math.sqrt(Math.pow(b, 2) + Math.pow(p, 2));
    var S = Math.PI,
        C = 180 / S,
        k = S / 180;
    var Y = 0 === M && 0 === i ? 0 : Math.atan2(i, M),
        z = 0 === b && 0 === p ? 0 : Math.atan2(p, b);
    Y < 0 && (Y += 2 * S), z < 0 && (z += 2 * S), Y *= C, z *= C;

    var I,
        X = c - s,
        Z = y - w,
        _ = z - Y,
        v = Y + z,
        G = Math.abs(_);

    w * y == 0 ? I = 0 : G <= 180 ? I = _ : _ > 180 ? I = _ - 360 : _ < -180 ? I = _ + 360 : console.log("the unthinkable has happened");
    var x,
        N = 2 * Math.sqrt(y * w) * Math.sin(I * k / 2),
        L = (s + c) / 2,
        j = (w + y) / 2,
        O = Math.pow(j, 7);
    x = w * y == 0 ? v : G <= 180 ? v / 2 : v < 360 ? (v + 360) / 2 : (v - 360) / 2;
    var A = Math.pow(L - 50, 2),
        E = 1 + .015 * A / Math.sqrt(20 + A),
        P = 1 + .045 * j,
        D = 1;
    D -= .17 * Math.cos((x - 30) * k), D += .24 * Math.cos(2 * x * k), D += .32 * Math.cos((3 * x + 6) * k), D -= .2 * Math.cos((4 * x - 63) * k);
    var q = 1 + .015 * j * D,
        T = 30 * Math.exp(-1 * Math.pow((x - 275) / 25, 2)),
        $ = 2 * Math.sqrt(O / (O + f)),
        R = Math.pow(X / (e * E), 2);
    return R += Math.pow(Z / (r * P), 2), R += Math.pow(N / (a * q), 2), R += -1 * Math.sin(2 * T * k) * $ * (Z / (r * P)) * (N / (a * q)), Math.sqrt(R);
  }, h.statify(["deltaE2000"]), h.prototype.deltaEJz = function (t) {
    t = h.get(t);

    var _this$jzczhz = _slicedToArray(this.jzczhz, 3),
        e = _this$jzczhz[0],
        r = _this$jzczhz[1],
        a = _this$jzczhz[2],
        _t$jzczhz = _slicedToArray(t.jzczhz, 3),
        s = _t$jzczhz[0],
        o = _t$jzczhz[1],
        i = _t$jzczhz[2],
        n = e - s,
        c = r - o;

    Number.isNaN(a) && Number.isNaN(i) ? (a = 0, i = 0) : Number.isNaN(a) ? a = i : Number.isNaN(i) && (i = a);
    var l = a - i,
        p = 2 * Math.sqrt(r * o) * Math.sin(l * Math.PI / 180);
    return Math.sqrt(Math.pow(n, 2) + Math.pow(c, 2) + Math.pow(p, 2));
  }, h.statify(["deltaEJz"]), h.prototype.deltaEITP = function (t) {
    t = h.get(t);

    var _this$ictcp = _slicedToArray(this.ictcp, 3),
        e = _this$ictcp[0],
        r = _this$ictcp[1],
        a = _this$ictcp[2],
        _t$ictcp = _slicedToArray(t.ictcp, 3),
        s = _t$ictcp[0],
        o = _t$ictcp[1],
        i = _t$ictcp[2];

    return 720 * Math.sqrt(Math.pow(e - s, 2) + .25 * Math.pow(r - o, 2) + Math.pow(a - i, 2));
  }, h.statify(["deltaEITP"]), h.prototype.deltaEOK = function (t) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    t = h.get(t);

    var _this$oklab = _slicedToArray(this.oklab, 3),
        r = _this$oklab[0],
        a = _this$oklab[1],
        s = _this$oklab[2],
        o = Math.sqrt(Math.pow(a, 2) + Math.pow(s, 2)),
        _t$oklab = _slicedToArray(t.oklab, 3),
        i = _t$oklab[0],
        n = _t$oklab[1],
        c = _t$oklab[2],
        l = Math.sqrt(Math.pow(n, 2) + Math.pow(c, 2));

    e.ΔL = r - i, e.ΔC = o - l;
    var p = Math.pow(a - n, 2) + Math.pow(s - c, 2) - Math.pow(e.ΔC, 2);
    p < 0 && (p = 0), e.ΔH = Math.sqrt(p);
    var u = Math.pow(e.ΔL, 2) + Math.pow(e.ΔC, 2) + p;
    return Math.sqrt(u);
  }, h.statify(["deltaEOK"]);
  var g = {
    aliceblue: [240 / 255, 248 / 255, 1],
    antiquewhite: [250 / 255, 235 / 255, 215 / 255],
    aqua: [0, 1, 1],
    aquamarine: [127 / 255, 1, 212 / 255],
    azure: [240 / 255, 1, 1],
    beige: [245 / 255, 245 / 255, 220 / 255],
    bisque: [1, 228 / 255, 196 / 255],
    black: [0, 0, 0],
    blanchedalmond: [1, 235 / 255, 205 / 255],
    blue: [0, 0, 1],
    blueviolet: [138 / 255, 43 / 255, 226 / 255],
    brown: [165 / 255, 42 / 255, 42 / 255],
    burlywood: [222 / 255, 184 / 255, 135 / 255],
    cadetblue: [95 / 255, 158 / 255, 160 / 255],
    chartreuse: [127 / 255, 1, 0],
    chocolate: [210 / 255, 105 / 255, 30 / 255],
    coral: [1, 127 / 255, 80 / 255],
    cornflowerblue: [100 / 255, 149 / 255, 237 / 255],
    cornsilk: [1, 248 / 255, 220 / 255],
    crimson: [220 / 255, 20 / 255, 60 / 255],
    cyan: [0, 1, 1],
    darkblue: [0, 0, 139 / 255],
    darkcyan: [0, 139 / 255, 139 / 255],
    darkgoldenrod: [184 / 255, 134 / 255, 11 / 255],
    darkgray: [169 / 255, 169 / 255, 169 / 255],
    darkgreen: [0, 100 / 255, 0],
    darkgrey: [169 / 255, 169 / 255, 169 / 255],
    darkkhaki: [189 / 255, 183 / 255, 107 / 255],
    darkmagenta: [139 / 255, 0, 139 / 255],
    darkolivegreen: [85 / 255, 107 / 255, 47 / 255],
    darkorange: [1, 140 / 255, 0],
    darkorchid: [.6, 50 / 255, .8],
    darkred: [139 / 255, 0, 0],
    darksalmon: [233 / 255, 150 / 255, 122 / 255],
    darkseagreen: [143 / 255, 188 / 255, 143 / 255],
    darkslateblue: [72 / 255, 61 / 255, 139 / 255],
    darkslategray: [47 / 255, 79 / 255, 79 / 255],
    darkslategrey: [47 / 255, 79 / 255, 79 / 255],
    darkturquoise: [0, 206 / 255, 209 / 255],
    darkviolet: [148 / 255, 0, 211 / 255],
    deeppink: [1, 20 / 255, 147 / 255],
    deepskyblue: [0, 191 / 255, 1],
    dimgray: [105 / 255, 105 / 255, 105 / 255],
    dimgrey: [105 / 255, 105 / 255, 105 / 255],
    dodgerblue: [30 / 255, 144 / 255, 1],
    firebrick: [178 / 255, 34 / 255, 34 / 255],
    floralwhite: [1, 250 / 255, 240 / 255],
    forestgreen: [34 / 255, 139 / 255, 34 / 255],
    fuchsia: [1, 0, 1],
    gainsboro: [220 / 255, 220 / 255, 220 / 255],
    ghostwhite: [248 / 255, 248 / 255, 1],
    gold: [1, 215 / 255, 0],
    goldenrod: [218 / 255, 165 / 255, 32 / 255],
    gray: [128 / 255, 128 / 255, 128 / 255],
    green: [0, 128 / 255, 0],
    greenyellow: [173 / 255, 1, 47 / 255],
    grey: [128 / 255, 128 / 255, 128 / 255],
    honeydew: [240 / 255, 1, 240 / 255],
    hotpink: [1, 105 / 255, 180 / 255],
    indianred: [205 / 255, 92 / 255, 92 / 255],
    indigo: [75 / 255, 0, 130 / 255],
    ivory: [1, 1, 240 / 255],
    khaki: [240 / 255, 230 / 255, 140 / 255],
    lavender: [230 / 255, 230 / 255, 250 / 255],
    lavenderblush: [1, 240 / 255, 245 / 255],
    lawngreen: [124 / 255, 252 / 255, 0],
    lemonchiffon: [1, 250 / 255, 205 / 255],
    lightblue: [173 / 255, 216 / 255, 230 / 255],
    lightcoral: [240 / 255, 128 / 255, 128 / 255],
    lightcyan: [224 / 255, 1, 1],
    lightgoldenrodyellow: [250 / 255, 250 / 255, 210 / 255],
    lightgray: [211 / 255, 211 / 255, 211 / 255],
    lightgreen: [144 / 255, 238 / 255, 144 / 255],
    lightgrey: [211 / 255, 211 / 255, 211 / 255],
    lightpink: [1, 182 / 255, 193 / 255],
    lightsalmon: [1, 160 / 255, 122 / 255],
    lightseagreen: [32 / 255, 178 / 255, 170 / 255],
    lightskyblue: [135 / 255, 206 / 255, 250 / 255],
    lightslategray: [119 / 255, 136 / 255, .6],
    lightslategrey: [119 / 255, 136 / 255, .6],
    lightsteelblue: [176 / 255, 196 / 255, 222 / 255],
    lightyellow: [1, 1, 224 / 255],
    lime: [0, 1, 0],
    limegreen: [50 / 255, 205 / 255, 50 / 255],
    linen: [250 / 255, 240 / 255, 230 / 255],
    magenta: [1, 0, 1],
    maroon: [128 / 255, 0, 0],
    mediumaquamarine: [.4, 205 / 255, 170 / 255],
    mediumblue: [0, 0, 205 / 255],
    mediumorchid: [186 / 255, 85 / 255, 211 / 255],
    mediumpurple: [147 / 255, 112 / 255, 219 / 255],
    mediumseagreen: [60 / 255, 179 / 255, 113 / 255],
    mediumslateblue: [123 / 255, 104 / 255, 238 / 255],
    mediumspringgreen: [0, 250 / 255, 154 / 255],
    mediumturquoise: [72 / 255, 209 / 255, .8],
    mediumvioletred: [199 / 255, 21 / 255, 133 / 255],
    midnightblue: [25 / 255, 25 / 255, 112 / 255],
    mintcream: [245 / 255, 1, 250 / 255],
    mistyrose: [1, 228 / 255, 225 / 255],
    moccasin: [1, 228 / 255, 181 / 255],
    navajowhite: [1, 222 / 255, 173 / 255],
    navy: [0, 0, 128 / 255],
    oldlace: [253 / 255, 245 / 255, 230 / 255],
    olive: [128 / 255, 128 / 255, 0],
    olivedrab: [107 / 255, 142 / 255, 35 / 255],
    orange: [1, 165 / 255, 0],
    orangered: [1, 69 / 255, 0],
    orchid: [218 / 255, 112 / 255, 214 / 255],
    palegoldenrod: [238 / 255, 232 / 255, 170 / 255],
    palegreen: [152 / 255, 251 / 255, 152 / 255],
    paleturquoise: [175 / 255, 238 / 255, 238 / 255],
    palevioletred: [219 / 255, 112 / 255, 147 / 255],
    papayawhip: [1, 239 / 255, 213 / 255],
    peachpuff: [1, 218 / 255, 185 / 255],
    peru: [205 / 255, 133 / 255, 63 / 255],
    pink: [1, 192 / 255, 203 / 255],
    plum: [221 / 255, 160 / 255, 221 / 255],
    powderblue: [176 / 255, 224 / 255, 230 / 255],
    purple: [128 / 255, 0, 128 / 255],
    rebeccapurple: [.4, .2, .6],
    red: [1, 0, 0],
    rosybrown: [188 / 255, 143 / 255, 143 / 255],
    royalblue: [65 / 255, 105 / 255, 225 / 255],
    saddlebrown: [139 / 255, 69 / 255, 19 / 255],
    salmon: [250 / 255, 128 / 255, 114 / 255],
    sandybrown: [244 / 255, 164 / 255, 96 / 255],
    seagreen: [46 / 255, 139 / 255, 87 / 255],
    seashell: [1, 245 / 255, 238 / 255],
    sienna: [160 / 255, 82 / 255, 45 / 255],
    silver: [192 / 255, 192 / 255, 192 / 255],
    skyblue: [135 / 255, 206 / 255, 235 / 255],
    slateblue: [106 / 255, 90 / 255, 205 / 255],
    slategray: [112 / 255, 128 / 255, 144 / 255],
    slategrey: [112 / 255, 128 / 255, 144 / 255],
    snow: [1, 250 / 255, 250 / 255],
    springgreen: [0, 1, 127 / 255],
    steelblue: [70 / 255, 130 / 255, 180 / 255],
    tan: [210 / 255, 180 / 255, 140 / 255],
    teal: [0, 128 / 255, 128 / 255],
    thistle: [216 / 255, 191 / 255, 216 / 255],
    tomato: [1, 99 / 255, 71 / 255],
    turquoise: [64 / 255, 224 / 255, 208 / 255],
    violet: [238 / 255, 130 / 255, 238 / 255],
    wheat: [245 / 255, 222 / 255, 179 / 255],
    white: [1, 1, 1],
    whitesmoke: [245 / 255, 245 / 255, 245 / 255],
    yellow: [1, 1, 0],
    yellowgreen: [154 / 255, 205 / 255, 50 / 255]
  };
  h.hooks.add("parse-start", function (t) {
    var e = t.str.toLowerCase(),
        r = {
      spaceId: "srgb",
      coords: null,
      alpha: 1
    };
    "transparent" === e ? (r.coords = g.black, r.alpha = 0) : r.coords = g[e], r.coords && (t.color = r);
  });

  var _id = /*#__PURE__*/new WeakMap();

  var _obj = /*#__PURE__*/new WeakMap();

  var _values$1 = /*#__PURE__*/new WeakMap();

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

      _classPrivateFieldInitSpec(this, _values$1, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(this, _id, id);

      _classPrivateFieldSet(this, _obj, obj);

      _classPrivateFieldSet(this, _values$1, []);
    } // public Methods


    _createClass(Attribute, [{
      key: "fetchValuesWithParentCategoryId",
      value: function fetchValuesWithParentCategoryId(parentCategoryId) {
        var _this = this;

        return new Promise(function (resolve, reject) {
          var values = _classPrivateFieldGet(_this, _values$1).filter(function (value) {
            return value.parentCategoryId === parentCategoryId;
          });

          if (values.length > 0) {
            resolve(values);
          } else {
            fetch("".concat(_this.api).concat(parentCategoryId ? "?node=".concat(parentCategoryId) : '')).then(function (responce) {
              return responce.json();
            }).then(function (values) {
              var _classPrivateFieldGet2;

              var __temp__values = values.map(function (value) {
                return {
                  categoryId: value.node,
                  count: value.count,
                  hasChild: !value.leaf,
                  label: value.label
                };
              }); // set parent category id
              // if (parentCategoryId) values.forEach(value => value.parentCategoryId = parentCategoryId);


              if (parentCategoryId) __temp__values.forEach(function (value) {
                return value.parentCategoryId = parentCategoryId;
              }); // set values
              // this.#values.push(...values);

              (_classPrivateFieldGet2 = _classPrivateFieldGet(_this, _values$1)).push.apply(_classPrivateFieldGet2, _toConsumableArray(__temp__values)); // resolve(values);


              resolve(__temp__values);
            }).catch(function (error) {
              console.error(_this, error);
              reject(error);
            });
          }
        });
      }
    }, {
      key: "getValue",
      value: function getValue(categoryId) {
        return _classPrivateFieldGet(this, _values$1).find(function (value) {
          return value.categoryId === categoryId;
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
      key: "values",
      get: function get() {
        return _classPrivateFieldGet(this, _values$1);
      }
    }]);

    return Attribute;
  }();

  var _catexxxgories = /*#__PURE__*/new WeakMap();

  var _attributes = /*#__PURE__*/new WeakMap();

  var _datasets = /*#__PURE__*/new WeakMap();

  var Records = /*#__PURE__*/function () {
    function Records() {
      _classCallCheck(this, Records);

      _classPrivateFieldInitSpec(this, _catexxxgories, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _attributes, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _datasets, {
        writable: true,
        value: void 0
      });
    } // public methods


    _createClass(Records, [{
      key: "setAttributes",
      value: function setAttributes(_ref) {
        var categories = _ref.categories,
            attributes = _ref.attributes,
            datasets = _ref.datasets;

        // define categories
        for (var i = 0; i < categories.length; i++) {
          var hue = 360 - 360 * i / categories.length + 130;
          hue -= hue > 360 ? 360 : 0;
          var srgb = new h('hsv', [hue, 45, 85]).to('srgb');
          var srgbStrong = new h('hsv', [hue, 65, 65]).to('srgb');
          categories[i].hue = hue;
          categories[i].color = srgb;
          categories[i].colorCSSValue = "rgb(".concat(srgb.coords.map(function (channel) {
            return channel * 256;
          }).join(','), ")");
          categories[i].colorCSSStrongValue = "rgb(".concat(srgbStrong.coords.map(function (channel) {
            return channel * 256;
          }).join(','), ")");
        }

        _classPrivateFieldSet(this, _catexxxgories, Object.freeze(categories)); // set attributes


        _classPrivateFieldSet(this, _attributes, Object.keys(attributes).map(function (id) {
          return new Attribute(id, attributes[id]);
        })); // make stylesheet


        var styleElm = document.createElement('style');
        document.head.appendChild(styleElm);
        var styleSheet = styleElm.sheet;
        styleSheet.insertRule(":root {\n      ".concat(categories.map(function (catexxxgory) {
          return "\n        --color-catexxxgory-".concat(catexxxgory.id, ": ").concat(catexxxgory.colorCSSValue, ";\n        --color-catexxxgory-").concat(catexxxgory.id, "-strong: ").concat(catexxxgory.colorCSSStrongValue, ";\n        ");
        }).join(''), "\n    }"));

        var _iterator = _createForOfIteratorHelper(categories),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var catexxxgory = _step.value;
            styleSheet.insertRule("\n      ._catexxxgory-color[data-catexxxgory-id=\"".concat(catexxxgory.id, "\"], [data-catexxxgory-id=\"").concat(catexxxgory.id, "\"] ._catexxxgory-color {\n        color: var(--color-catexxxgory-").concat(catexxxgory.id, "-strong);\n      }"));
            styleSheet.insertRule("\n      ._catexxxgory-background-color[data-catexxxgory-id=\"".concat(catexxxgory.id, "\"], [data-catexxxgory-id=\"").concat(catexxxgory.id, "\"] ._catexxxgory-background-color {\n        background-color: var(--color-catexxxgory-").concat(catexxxgory.id, ");\n      }"));
            styleSheet.insertRule("\n      ._catexxxgory-background-color-strong[data-catexxxgory-id=\"".concat(catexxxgory.id, "\"], [data-catexxxgory-id=\"").concat(catexxxgory.id, "\"] ._catexxxgory-background-color-strong {\n        background-color: var(--color-catexxxgory-").concat(catexxxgory.id, "-strong);\n      }"));
            styleSheet.insertRule("\n      ._catexxxgory-border-color[data-catexxxgory-id=\"".concat(catexxxgory.id, "\"], [data-catexxxgory-id=\"").concat(catexxxgory.id, "\"] ._catexxxgory-border-color {\n        border-color: var(--color-catexxxgory-").concat(catexxxgory.id, ");\n      }"));
          } // set datasets

        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        _classPrivateFieldSet(this, _datasets, datasets);
      }
    }, {
      key: "fetchAttributeValues",
      value: function fetchAttributeValues(attributeId, categoryId) {
        var attribute = this.getAttribute(attributeId);
        return attribute.fetchValuesWithParentCategoryId(categoryId);
      }
    }, {
      key: "getCatexxxgory",
      value: function getCatexxxgory(id) {
        return _classPrivateFieldGet(this, _catexxxgories).find(function (category) {
          return category.id === id;
        });
      }
    }, {
      key: "getCatexxxgoryWithAttributeId",
      value: function getCatexxxgoryWithAttributeId(attributeId) {
        return _classPrivateFieldGet(this, _catexxxgories).find(function (category) {
          return category.attributes.indexOf(attributeId) !== -1;
        });
      }
    }, {
      key: "getAttribute",
      value: function getAttribute(attributeId) {
        return _classPrivateFieldGet(this, _attributes).find(function (attribute) {
          return attribute.id === attributeId;
        });
      }
    }, {
      key: "getValue",
      value: function getValue(attributeId, categoryId) {
        var attribute = this.getAttribute(attributeId);
        return attribute.getValue(categoryId);
      }
    }, {
      key: "getValuesWithParentCategoryId",
      value: function getValuesWithParentCategoryId(attributeId, parentCategoryId) {
        var attribute = this.getAttribute(attributeId);
        return attribute.values.filter(function (value) {
          return value.parentCategoryId === parentCategoryId;
        });
      }
    }, {
      key: "getAncestors",
      value: function getAncestors(attributeId, categoryId) {
        var attribute = this.getAttribute(attributeId);
        var ancestors = [];
        var parent;

        do {
          var _parent;

          // find ancestors
          parent = attribute.values.find(function (value) {
            return value.categoryId === categoryId;
          });
          if (parent) ancestors.unshift(parent);
          categoryId = (_parent = parent) === null || _parent === void 0 ? void 0 : _parent.parentCategoryId;
        } while (parent);

        ancestors.pop();
        return ancestors;
      }
    }, {
      key: "getDatasetLabel",
      value: function getDatasetLabel(dataset) {
        return _classPrivateFieldGet(this, _datasets)[dataset].label;
      } // public accessors

    }, {
      key: "catexxxgories",
      get: function get() {
        return _classPrivateFieldGet(this, _catexxxgories);
      }
    }, {
      key: "attributes",
      get: function get() {
        return _classPrivateFieldGet(this, _attributes);
      }
    }]);

    return Records;
  }();

  var Records$1 = new Records();

  var _key = /*#__PURE__*/new WeakMap();

  var _catexxxgoryId = /*#__PURE__*/new WeakMap();

  var _dataset = /*#__PURE__*/new WeakMap();

  var BaseCondition = /*#__PURE__*/function () {
    // <Attribute>
    function BaseCondition(attributeId) {
      _classCallCheck(this, BaseCondition);

      _defineProperty$1(this, "_attributeId", void 0);

      _classPrivateFieldInitSpec(this, _key, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _catexxxgoryId, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _dataset, {
        writable: true,
        value: void 0
      });

      this._attributeId = attributeId;
    } // accessor


    _createClass(BaseCondition, [{
      key: "attributeId",
      get: function get() {
        return this._attributeId;
      }
    }, {
      key: "key",
      get: function get() {
        if (!_classPrivateFieldGet(this, _key)) _classPrivateFieldSet(this, _key, Records$1.getAttribute(this._attributeId));
        return _classPrivateFieldGet(this, _key);
      }
    }, {
      key: "catexxxgoryId",
      get: function get() {
        if (!_classPrivateFieldGet(this, _catexxxgoryId)) {
          _classPrivateFieldSet(this, _catexxxgoryId, Records$1.getCatexxxgoryWithAttributeId(this.key.id).id);
        }

        return _classPrivateFieldGet(this, _catexxxgoryId);
      }
    }, {
      key: "dataset",
      get: function get() {
        if (!_classPrivateFieldGet(this, _dataset)) {
          _classPrivateFieldSet(this, _dataset, this.key.dataset);
        }

        return _classPrivateFieldGet(this, _dataset);
      }
    }]);

    return BaseCondition;
  }();

  var _parentCategoryId$1 = /*#__PURE__*/new WeakMap();

  var _value = /*#__PURE__*/new WeakMap();

  var _ancestors = /*#__PURE__*/new WeakMap();

  var KeyCondition = /*#__PURE__*/function (_BaseCondition) {
    _inherits(KeyCondition, _BaseCondition);

    var _super = _createSuper(KeyCondition);

    function KeyCondition(attributeId, parentCategoryId) {
      var _this;

      _classCallCheck(this, KeyCondition);

      _this = _super.call(this, attributeId);

      _classPrivateFieldInitSpec(_assertThisInitialized(_this), _parentCategoryId$1, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(_assertThisInitialized(_this), _value, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(_assertThisInitialized(_this), _ancestors, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(_assertThisInitialized(_this), _parentCategoryId$1, parentCategoryId);

      return _this;
    } // methods

    /**
     * 
     * @param {String} attributeId 
     * @param {String} parentCategoryId 
     * @return {Boolean}
     */


    _createClass(KeyCondition, [{
      key: "isSameCondition",
      value: function isSameCondition(attributeId, parentCategoryId) {
        if (attributeId === this._attributeId) {
          if (parentCategoryId) {
            return parentCategoryId === _classPrivateFieldGet(this, _parentCategoryId$1);
          } else {
            return true;
          }
        } else {
          return false;
        }
      }
    }, {
      key: "getURLParameter",
      value: function getURLParameter() {
        var key = {
          attributeId: this._attributeId
        };

        if (_classPrivateFieldGet(this, _parentCategoryId$1)) {
          key.id = {
            categoryId: _classPrivateFieldGet(this, _parentCategoryId$1),
            ancestors: this.ancestors
          };
        }

        return key;
      } // accessor

    }, {
      key: "parentCategoryId",
      get: function get() {
        return _classPrivateFieldGet(this, _parentCategoryId$1);
      }
    }, {
      key: "ancestors",
      get: function get() {
        if (!_classPrivateFieldGet(this, _ancestors)) {
          _classPrivateFieldSet(this, _ancestors, Records$1.getAncestors(this._attributeId, _classPrivateFieldGet(this, _parentCategoryId$1)).map(function (ancestor) {
            return ancestor.categoryId;
          }));
        }

        return _classPrivateFieldGet(this, _ancestors);
      }
    }, {
      key: "label",
      get: function get() {
        if (_classPrivateFieldGet(this, _parentCategoryId$1)) {
          return this.value.label;
        } else {
          return this.key.label;
        }
      }
    }, {
      key: "value",
      get: function get() {
        if (!_classPrivateFieldGet(this, _value)) {
          _classPrivateFieldSet(this, _value, Records$1.getValue(this._attributeId, _classPrivateFieldGet(this, _parentCategoryId$1)));
        }

        return _classPrivateFieldGet(this, _value);
      }
    }, {
      key: "query",
      get: function get() {
        var query = {
          attribute: this._attributeId
        };
        if (_classPrivateFieldGet(this, _parentCategoryId$1)) query.node = _classPrivateFieldGet(this, _parentCategoryId$1);
        return query;
      }
    }]);

    return KeyCondition;
  }(BaseCondition);

  var _categoryIds = /*#__PURE__*/new WeakMap();

  var ValuesCondition = /*#__PURE__*/function (_BaseCondition) {
    _inherits(ValuesCondition, _BaseCondition);

    var _super = _createSuper(ValuesCondition);

    function ValuesCondition(attributeId, categoryIds) {
      var _this;

      _classCallCheck(this, ValuesCondition);

      _this = _super.call(this, attributeId);

      _classPrivateFieldInitSpec(_assertThisInitialized(_this), _categoryIds, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(_assertThisInitialized(_this), _categoryIds, categoryIds);

      return _this;
    } // methods


    _createClass(ValuesCondition, [{
      key: "addCategoryId",
      value: function addCategoryId(categoryId) {
        _classPrivateFieldGet(this, _categoryIds).push(categoryId);
      }
    }, {
      key: "removeCategoryId",
      value: function removeCategoryId(categoryId) {
        var index = _classPrivateFieldGet(this, _categoryIds).indexOf(categoryId);

        _classPrivateFieldGet(this, _categoryIds).splice(index, 1);
      }
    }, {
      key: "getURLParameter",
      value: function getURLParameter() {
        var _this2 = this;

        var values = {
          attributeId: this._attributeId,
          ids: []
        };

        _classPrivateFieldGet(this, _categoryIds).forEach(function (categoryId) {
          var id = {
            categoryId: categoryId
          };
          var ancestors = Records$1.getAncestors(_this2._attributeId, categoryId).map(function (ancestor) {
            return ancestor.categoryId;
          });
          if (ancestors.length > 0) id.ancestors = ancestors;
          values.ids.push(id);
        });

        return values;
      } // accessor

    }, {
      key: "categoryIds",
      get: function get() {
        return _classPrivateFieldGet(this, _categoryIds);
      }
    }, {
      key: "label",
      get: function get() {
        return this.key.label;
      }
    }, {
      key: "query",
      get: function get() {
        return {
          attribute: this._attributeId,
          nodes: this.categoryIds
        };
      }
    }]);

    return ValuesCondition;
  }(BaseCondition);

  var _togoKey$1 = /*#__PURE__*/new WeakMap();

  var _keyConditions$1 = /*#__PURE__*/new WeakMap();

  var _valuesConditions$1 = /*#__PURE__*/new WeakMap();

  var _copyKeyConditions = /*#__PURE__*/new WeakSet();

  var _copyValuesConditions = /*#__PURE__*/new WeakSet();

  var DXCondition = /*#__PURE__*/function () {
    function DXCondition(togoKey, _keyConditions2, _valuesConditions2) {
      _classCallCheck(this, DXCondition);

      _classPrivateMethodInitSpec(this, _copyValuesConditions);

      _classPrivateMethodInitSpec(this, _copyKeyConditions);

      _classPrivateFieldInitSpec(this, _togoKey$1, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _keyConditions$1, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _valuesConditions$1, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(this, _togoKey$1, togoKey);

      _classPrivateFieldSet(this, _keyConditions$1, _classPrivateMethodGet(this, _copyKeyConditions, _copyKeyConditions2).call(this, _keyConditions2));

      _classPrivateFieldSet(this, _valuesConditions$1, _classPrivateMethodGet(this, _copyValuesConditions, _copyValuesConditions2).call(this, _valuesConditions2));
    } // methods

    /**
     * 
     * @param {DXCondition} dxCondition 
     * @return Boolean
     */


    _createClass(DXCondition, [{
      key: "checkSameCondition",
      value: function checkSameCondition(dxCondition) {
        // keys
        var matchKeys = false;

        if (this.keyConditions.length === dxCondition.keyConditions.length) {
          matchKeys = this.keyConditions.every(function (keyCondition) {
            return dxCondition.keyConditions.findIndex(function (newKeyCondition) {
              return keyCondition.attributeId === newKeyCondition.attributeId && keyCondition.parentCategoryId === newKeyCondition.parentCategoryId;
            }) !== -1;
          });
        } // values


        var matchValues = false;

        if (this.valuesConditions.length === dxCondition.valuesConditions.length) {
          matchValues = this.valuesConditions.every(function (valuesCondition) {
            return dxCondition.valuesConditions.findIndex(function (newValuesCondition) {
              return valuesCondition.attributeId === newValuesCondition.attributeId && valuesCondition.categoryIds.length === newValuesCondition.categoryIds.length && valuesCondition.categoryIds.every(function (categoryId) {
                return newValuesCondition.categoryIds.findIndex(function (newCategoryId) {
                  return categoryId === newCategoryId;
                }) !== -1;
              });
            }) !== -1;
          });
        }

        return dxCondition.togoKey === this.togoKey && matchKeys && matchValues;
      }
    }, {
      key: "togoKey",
      get: // accessor
      function get() {
        return _classPrivateFieldGet(this, _togoKey$1);
      }
    }, {
      key: "keyConditions",
      get: function get() {
        return _classPrivateFieldGet(this, _keyConditions$1);
      }
    }, {
      key: "valuesConditions",
      get: function get() {
        return _classPrivateFieldGet(this, _valuesConditions$1);
      }
    }, {
      key: "queryFilters",
      get: function get() {
        return _classPrivateFieldGet(this, _valuesConditions$1).map(function (valuesConditions) {
          return valuesConditions.query;
        });
      }
    }, {
      key: "queryAnnotations",
      get: function get() {
        return _classPrivateFieldGet(this, _keyConditions$1).map(function (keyConditions) {
          return keyConditions.query;
        });
      }
    }]);

    return DXCondition;
  }();

  function _copyKeyConditions2(keyConditions) {
    return keyConditions.map(function (keyCondition) {
      return new KeyCondition(keyCondition.attributeId, keyCondition.parentCategoryId);
    });
  }

  function _copyValuesConditions2(valuesConditions) {
    return valuesConditions.map(function (valuesCondition) {
      return new ValuesCondition(valuesCondition.attributeId, _toConsumableArray(valuesCondition.categoryIds));
    });
  }

  // TogoKey
  var defineTogoKey = 'defineTogoKey'; // User IDs

  var setUserValues = 'setUserValues';
  var clearUserValues = 'clearUserValues';
  var toggleErrorUserValues = 'toggleErrorUserValues'; // View mode

  var changeViewModes = 'changeViewModes'; // Condition

  var mutateAttributeCondition = 'mutateAttributeCondition';
  var mutateAttributeValueCondition = 'mutateAttributeValueCondition';
  var mutateEstablishConditions = 'mutateEstablishConditions';
  var completeQueryParameter = 'completeQueryParameter';
  var restoreParameters = 'restoreParameters';
  var clearCondition = 'clearCondition'; // Stanza

  var hideStanza = 'hideStanza';

  var hidePopup = 'hidePopup';
  var showPopup = 'showPopup';
  var movePopup = 'movePopup'; // Dragging

  var dragElement = 'dragElement'; // Polling

  var failedFetchTableDataIds = 'failedFetchTableDataIds';
  var addNextRows = 'addNextRows'; // Table data

  var selectTableData = 'selectTableData';
  var deleteTableData = 'deleteTableData';
  var highlightCol = 'highlightCol'; // Track

  var enterAttributeValueItemView = 'enterAttributeValueItemView';
  var leaveAttributeValueItemView = 'leaveAttributeValueItemView';
  var allTracksCollapse = 'allTracksCollapse'; // Statistics

  var changeStatisticsViewMode = 'changeStatisticsViewMode'; // Column selector

  var changeColumnSelectorSorter = 'changeColumnSelectorSorter'; // Collpase

  var collapsed = 'collapsed';

  var _keyConditions = /*#__PURE__*/new WeakMap();

  var _valuesConditions = /*#__PURE__*/new WeakMap();

  var _togoKey = /*#__PURE__*/new WeakMap();

  var _userIds = /*#__PURE__*/new WeakMap();

  var _isRestoredConditinoFromURLParameters = /*#__PURE__*/new WeakMap();

  var _preparingCounter = /*#__PURE__*/new WeakMap();

  var _postProcessing = /*#__PURE__*/new WeakSet();

  var _createSearchConditionFromURLParameters = /*#__PURE__*/new WeakSet();

  var _makeQueueOfGettingChildCategoryIds = /*#__PURE__*/new WeakSet();

  var _progressQueueOfGettingChildCategoryIds = /*#__PURE__*/new WeakSet();

  var _getChildCategoryIds = /*#__PURE__*/new WeakSet();

  var _restoreConditions = /*#__PURE__*/new WeakSet();

  var _clearConditinos = /*#__PURE__*/new WeakSet();

  var _getCondtionsFromHierarchicConditions = /*#__PURE__*/new WeakSet();

  var ConditionBuilder = /*#__PURE__*/function () {
    // Array<KeyCondition>
    // Array<ValuesCondition>
    function ConditionBuilder() {
      _classCallCheck(this, ConditionBuilder);

      _classPrivateMethodInitSpec(this, _getCondtionsFromHierarchicConditions);

      _classPrivateMethodInitSpec(this, _clearConditinos);

      _classPrivateMethodInitSpec(this, _restoreConditions);

      _classPrivateMethodInitSpec(this, _getChildCategoryIds);

      _classPrivateMethodInitSpec(this, _progressQueueOfGettingChildCategoryIds);

      _classPrivateMethodInitSpec(this, _makeQueueOfGettingChildCategoryIds);

      _classPrivateMethodInitSpec(this, _createSearchConditionFromURLParameters);

      _classPrivateMethodInitSpec(this, _postProcessing);

      _classPrivateFieldInitSpec(this, _keyConditions, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _valuesConditions, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _togoKey, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _userIds, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _isRestoredConditinoFromURLParameters, {
        writable: true,
        value: false
      });

      _classPrivateFieldInitSpec(this, _preparingCounter, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(this, _keyConditions, []);

      _classPrivateFieldSet(this, _valuesConditions, []);

      _classPrivateFieldSet(this, _preparingCounter, 0);

      _classPrivateFieldSet(this, _isRestoredConditinoFromURLParameters, false); // event listeners


      window.addEventListener('popstate', _classPrivateMethodGet(this, _createSearchConditionFromURLParameters, _createSearchConditionFromURLParameters2).bind(this));
      DefaultEventEmitter$1.addEventListener(clearCondition, _classPrivateMethodGet(this, _clearConditinos, _clearConditinos2).bind(this));
    } // public methods


    _createClass(ConditionBuilder, [{
      key: "init",
      value: function init() {
        _classPrivateMethodGet(this, _createSearchConditionFromURLParameters, _createSearchConditionFromURLParameters2).call(this, true);
      }
    }, {
      key: "setSubject",
      value: function setSubject(togoKey) {
        _classPrivateFieldSet(this, _togoKey, togoKey);

        _classPrivateMethodGet(this, _postProcessing, _postProcessing2).call(this);
      }
    }, {
      key: "setUserIds",
      value: function setUserIds() {
        var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        _classPrivateFieldSet(this, _userIds, ids.replace(/,/g, " ").split(/\s+/).join(',')); // post processing (permalink, evaluate)


        _classPrivateMethodGet(this, _postProcessing, _postProcessing2).call(this);
      }
    }, {
      key: "addAttribute",
      value: function addAttribute(attributeId, parentCategoryId) {
        var isFinal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        // store
        var keyCondition = new KeyCondition(attributeId, parentCategoryId);

        _classPrivateFieldGet(this, _keyConditions).push(keyCondition); // evaluate


        if (isFinal) _classPrivateMethodGet(this, _postProcessing, _postProcessing2).call(this); // dispatch event

        var customEvent = new CustomEvent(mutateAttributeCondition, {
          detail: {
            action: 'add',
            keyCondition: keyCondition
          }
        });
        DefaultEventEmitter$1.dispatchEvent(customEvent);
      }
    }, {
      key: "addAttributeValue",
      value: function addAttributeValue(attributeId, categoryId) {
        var isFinal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

        // find value of same property
        var sameValuesCondition = _classPrivateFieldGet(this, _valuesConditions).find(function (valuesCondition) {
          return valuesCondition.attributeId === attributeId;
        }); // store


        if (sameValuesCondition) {
          sameValuesCondition.addCategoryId(categoryId);
        } else {
          var valuesCondition = new ValuesCondition(attributeId, [categoryId]);

          _classPrivateFieldGet(this, _valuesConditions).push(valuesCondition);
        } // evaluate


        if (isFinal) _classPrivateMethodGet(this, _postProcessing, _postProcessing2).call(this); // dispatch event

        var customEvent = new CustomEvent(mutateAttributeValueCondition, {
          detail: {
            action: 'add',
            attributeId: attributeId,
            categoryId: categoryId
          }
        });
        DefaultEventEmitter$1.dispatchEvent(customEvent);
      }
    }, {
      key: "removeAttribute",
      value: function removeAttribute(attributeId, parentCategoryId) {
        var isFinal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        // remove from store
        var index = _classPrivateFieldGet(this, _keyConditions).findIndex(function (keyCondition) {
          return keyCondition.isSameCondition(attributeId, parentCategoryId);
        });

        if (index === -1) return;

        var keyCondition = _classPrivateFieldGet(this, _keyConditions).splice(index, 1)[0]; // post processing (permalink, evaluate)


        if (isFinal) _classPrivateMethodGet(this, _postProcessing, _postProcessing2).call(this); // dispatch event

        var customEvent = new CustomEvent(mutateAttributeCondition, {
          detail: {
            action: 'remove',
            keyCondition: keyCondition
          }
        });
        DefaultEventEmitter$1.dispatchEvent(customEvent);
      }
    }, {
      key: "removeAttributeValue",
      value: function removeAttributeValue(attributeId, categoryId) {
        var isFinal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        // remove from store
        var index = _classPrivateFieldGet(this, _valuesConditions).findIndex(function (valuesCondition) {
          if (valuesCondition.attributeId === attributeId) {
            valuesCondition.removeCategoryId(categoryId);
            return valuesCondition.categoryIds.length === 0;
          } else {
            return false;
          }
        });

        if (index !== -1) _classPrivateFieldGet(this, _valuesConditions).splice(index, 1)[0]; // post processing (permalink, evaluate)

        if (isFinal) _classPrivateMethodGet(this, _postProcessing, _postProcessing2).call(this); // dispatch event

        var customEvent = new CustomEvent(mutateAttributeValueCondition, {
          detail: {
            action: 'remove',
            attributeId: attributeId,
            categoryId: categoryId
          }
        });
        DefaultEventEmitter$1.dispatchEvent(customEvent);
      }
    }, {
      key: "setAttributes",
      value: function setAttributes(conditions) {
        var _this = this;

        var isFinal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        // delete existing properties
        while (_classPrivateFieldGet(this, _keyConditions).length > 0) {
          this.removeAttribute(_classPrivateFieldGet(this, _keyConditions)[0].attributeId, _classPrivateFieldGet(this, _keyConditions)[0].parentCategoryId, false);
        }

        conditions.forEach(function (_ref) {
          var attributeId = _ref.attributeId,
              parentCategoryId = _ref.parentCategoryId;
          return _this.addAttribute(attributeId, parentCategoryId, false);
        }); // post processing (permalink, evaluate)

        if (isFinal) _classPrivateMethodGet(this, _postProcessing, _postProcessing2).call(this);
      }
    }, {
      key: "setAttributeValues",
      value: function setAttributeValues(attributeId, categoryIds) {
        var _this2 = this;

        var isFinal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        var oldValuesCondition = _classPrivateFieldGet(this, _valuesConditions).find(function (valuesCondition) {
          return valuesCondition.attributeId === attributeId;
        });

        if (oldValuesCondition) {
          var originalValues = Records$1.getAttribute(attributeId).values;
          originalValues.forEach(function (originalValue) {
            var indexInNew = categoryIds.indexOf(originalValue.categoryId);
            var indexInOld = oldValuesCondition.categoryIds.indexOf(originalValue.categoryId);

            if (indexInNew !== -1) {
              // if new value does not exist in old values, add property value
              if (indexInOld === -1) _this2.addAttributeValue(attributeId, originalValue.categoryId, [], false);
            } else {
              // if extra value exists in old values, remove property value
              if (indexInOld !== -1) _this2.removeAttributeValue(attributeId, originalValue.categoryId, false);
            }
          });
        } else {
          var _iterator = _createForOfIteratorHelper(categoryIds),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var categoryId = _step.value;
              this.addAttributeValue(attributeId, categoryId, [], false);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } // post processing (permalink, evaluate)


        if (isFinal) _classPrivateMethodGet(this, _postProcessing, _postProcessing2).call(this);
      }
    }, {
      key: "finish",
      value: function finish(dontLeaveInHistory) {
        _classPrivateMethodGet(this, _postProcessing, _postProcessing2).call(this, dontLeaveInHistory);
      }
    }, {
      key: "makeQueryParameter",
      value: function makeQueryParameter() {
        // emmit event
        var customEvent = new CustomEvent(completeQueryParameter, {
          detail: new DXCondition(_classPrivateFieldGet(this, _togoKey), _classPrivateFieldGet(this, _keyConditions), _classPrivateFieldGet(this, _valuesConditions))
        });
        DefaultEventEmitter$1.dispatchEvent(customEvent);
      }
    }, {
      key: "getSelectedCategoryIds",
      value: function getSelectedCategoryIds(attributeId) {
        var _categoryIds$keys, _categoryIds$values;

        var categoryIds = {
          keys: [],
          values: []
        };

        var keyConditions = _classPrivateFieldGet(this, _keyConditions).filter(function (keyCondition) {
          return keyCondition.attributeId === attributeId;
        });

        var valuesCondition = _classPrivateFieldGet(this, _valuesConditions).find(function (valuesCondition) {
          return valuesCondition.attributeId === attributeId;
        });

        if (keyConditions) (_categoryIds$keys = categoryIds.keys).push.apply(_categoryIds$keys, _toConsumableArray(keyConditions.map(function (keyCondiiton) {
          return keyCondiiton.parentCategoryId;
        })));
        if (valuesCondition) (_categoryIds$values = categoryIds.values).push.apply(_categoryIds$values, _toConsumableArray(valuesCondition.categoryIds));
        return categoryIds;
      } // public accessor

    }, {
      key: "currentTogoKey",
      get: function get() {
        return _classPrivateFieldGet(this, _togoKey);
      }
    }, {
      key: "userIds",
      get: function get() {
        return !_classPrivateFieldGet(this, _userIds) ? [] : _classPrivateFieldGet(this, _userIds).split(',');
      } // private methods

    }]);

    return ConditionBuilder;
  }();

  function _postProcessing2() {
    var dontLeaveInHistory = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    if (!_classPrivateFieldGet(this, _isRestoredConditinoFromURLParameters)) return; // evaluate if search is possible

    var established = _classPrivateFieldGet(this, _togoKey) && _classPrivateFieldGet(this, _valuesConditions).length > 0;
    var customEvent = new CustomEvent(mutateEstablishConditions, {
      detail: established
    });
    DefaultEventEmitter$1.dispatchEvent(customEvent); // get hierarchic conditions

    var keys = _classPrivateFieldGet(this, _keyConditions).map(function (keyCondiiton) {
      return keyCondiiton.getURLParameter();
    });

    var values = _classPrivateFieldGet(this, _valuesConditions).map(function (valuesCondition) {
      return valuesCondition.getURLParameter();
    });

    console.log(keys);
    console.log(values);

    var __zzz__keys = keys.map(function (key) {
      var zzzKey = {
        attribute: key.attributeId
      };

      if (key.id) {
        var node = {
          node: key.id.categoryId
        };

        if (key.id.ancestors) {
          node.ancestors = key.id.ancestors;
        }

        zzzKey.node = node;
      }

      return zzzKey;
    });

    console.log(__zzz__keys);

    var __zzz__values = values.map(function (value) {
      var zzzValue = {
        attribute: value.attributeId
      };

      if (value.ids) {
        zzzValue.nodes = value.ids.map(function (id) {
          return {
            node: id.categoryId
          };
        });
      }

      return zzzValue;
    });

    console.log(__zzz__values); // generate permalink

    var params = new URL(location).searchParams;
    params.set('togoKey', _classPrivateFieldGet(this, _togoKey));
    params.set('keys', JSON.stringify(keys));
    params.set('values', JSON.stringify(values));
    params.set('dataset', _classPrivateFieldGet(this, _togoKey));
    params.set('annotations', JSON.stringify(__zzz__keys));
    params.set('filters', JSON.stringify(__zzz__values));
    if (dontLeaveInHistory) window.history.pushState(null, '', "".concat(window.location.origin).concat(window.location.pathname, "?").concat(params.toString()));
  }

  function _createSearchConditionFromURLParameters2() {
    var _JSON$parse, _JSON$parse2;

    var isFirst = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    // get conditions with ancestors
    var params = new URL(location).searchParams;
    var condition = {
      togoKey: params.get('togoKey'),
      keys: (_JSON$parse = JSON.parse(params.get('keys'))) !== null && _JSON$parse !== void 0 ? _JSON$parse : [],
      values: (_JSON$parse2 = JSON.parse(params.get('values'))) !== null && _JSON$parse2 !== void 0 ? _JSON$parse2 : []
    }; // in older versions, 'attributeId' is 'propertyId', so convert them

    condition.keys.forEach(function (key) {
      if (key.propertyId) {
        key.attributeId = key.propertyId;
        delete key.propertyId;
      }
    });
    condition.values.forEach(function (key) {
      if (key.propertyId) {
        key.attributeId = key.propertyId;
        delete key.propertyId;
      }
    });

    if (isFirst) {
      // get child category ids
      _classPrivateMethodGet(this, _makeQueueOfGettingChildCategoryIds, _makeQueueOfGettingChildCategoryIds2).call(this, condition);
    } else {
      _classPrivateMethodGet(this, _restoreConditions, _restoreConditions2).call(this, condition);
    }
  }

  function _makeQueueOfGettingChildCategoryIds2(condition) {
    if (condition.togoKey) _classPrivateFieldSet(this, _togoKey, condition.togoKey);
    var queue = [];

    var addQueue = function addQueue(attributeId, id) {
      var ancestors = [id.categoryId];
      if (id.ancestors) ancestors.push.apply(ancestors, _toConsumableArray(id.ancestors));
      ancestors.forEach(function (categoryId) {
        if (queue.findIndex(function (task) {
          return task.attributeId === attributeId && task.categoryId === categoryId;
        }) === -1) {
          queue.push({
            attributeId: attributeId,
            categoryId: categoryId
          });
        }
      });
    };

    condition.keys.forEach(function (_ref2) {
      var attributeId = _ref2.attributeId,
          id = _ref2.id;
      if (id) addQueue(attributeId, id);
    });
    condition.values.forEach(function (_ref3) {
      var attributeId = _ref3.attributeId,
          ids = _ref3.ids;
      ids.forEach(function (id) {
        if (id.ancestors) addQueue(attributeId, id);
      });
    });

    _classPrivateMethodGet(this, _progressQueueOfGettingChildCategoryIds, _progressQueueOfGettingChildCategoryIds2).call(this, condition, queue);
  }

  function _progressQueueOfGettingChildCategoryIds2(condition, queue) {
    var _this3 = this;

    if (queue.length > 0) {
      var _queue$shift = queue.shift(),
          attributeId = _queue$shift.attributeId,
          categoryId = _queue$shift.categoryId;

      _classPrivateMethodGet(this, _getChildCategoryIds, _getChildCategoryIds2).call(this, attributeId, categoryId).then(function () {
        return _classPrivateMethodGet(_this3, _progressQueueOfGettingChildCategoryIds, _progressQueueOfGettingChildCategoryIds2).call(_this3, condition, queue);
      });
    } else {
      _classPrivateMethodGet(this, _restoreConditions, _restoreConditions2).call(this, condition);
    }
  }

  function _getChildCategoryIds2(attributeId, categoryId) {
    return new Promise(function (resolve, reject) {
      Records$1.fetchAttributeValues(attributeId, categoryId).then(function (values) {
        resolve();
      }).catch(function (error) {
        reject(error);
      });
    });
  }

  function _restoreConditions2(_ref4) {
    var _this4 = this;

    var togoKey = _ref4.togoKey;
        _ref4.userIds;
        var keys = _ref4.keys,
        values = _ref4.values;

    _classPrivateFieldSet(this, _isRestoredConditinoFromURLParameters, true); // restore conditions


    _classPrivateFieldSet(this, _togoKey, togoKey); // this.#userIds = userIds;


    var _classPrivateMethodGe = _classPrivateMethodGet(this, _getCondtionsFromHierarchicConditions, _getCondtionsFromHierarchicConditions2).call(this, keys, values),
        _classPrivateMethodGe2 = _slicedToArray(_classPrivateMethodGe, 2),
        keys2 = _classPrivateMethodGe2[0],
        values2 = _classPrivateMethodGe2[1];

    this.setAttributes(keys2, false);
    Records$1.attributes.forEach(function (_ref5) {
      var id = _ref5.id;
      var attribute = values2.find(function (attribute) {
        return attribute.attributeId === id;
      });
      var categoryIds = [];
      if (attribute) categoryIds.push.apply(categoryIds, _toConsumableArray(attribute.categoryIds));

      _this4.setAttributeValues(id, categoryIds, false);
    });
    this.finish(false); // dispatch event

    var customEvent = new CustomEvent(restoreParameters, {
      detail: {
        togoKey: togoKey,
        keys: keys,
        values: values
      }
    });
    DefaultEventEmitter$1.dispatchEvent(customEvent);
  }

  function _clearConditinos2() {
    while (_classPrivateFieldGet(this, _keyConditions).length > 0) {
      var _classPrivateFieldGet2 = _classPrivateFieldGet(this, _keyConditions)[0],
          attributeId = _classPrivateFieldGet2.attributeId,
          parentCategoryId = _classPrivateFieldGet2.parentCategoryId;

      this.removeAttribute(attributeId, parentCategoryId, false);
    }

    while (_classPrivateFieldGet(this, _valuesConditions).length > 0) {
      var _classPrivateFieldGet3 = _classPrivateFieldGet(this, _valuesConditions)[0],
          _attributeId = _classPrivateFieldGet3.attributeId,
          categoryIds = _classPrivateFieldGet3.categoryIds;

      while (categoryIds.length > 0) {
        this.removeAttributeValue(_attributeId, categoryIds[0], false);
      }
    }

    _classPrivateMethodGet(this, _postProcessing, _postProcessing2).call(this);
  }

  function _getCondtionsFromHierarchicConditions2(keys, values) {
    // restore conditions
    var keys2 = keys.map(function (_ref6) {
      var attributeId = _ref6.attributeId,
          id = _ref6.id;
      return {
        attributeId: attributeId,
        parentCategoryId: id === null || id === void 0 ? void 0 : id.categoryId
      };
    });
    var values2 = values.map(function (_ref7) {
      var attributeId = _ref7.attributeId,
          ids = _ref7.ids;
      return {
        attributeId: attributeId,
        categoryIds: ids.map(function (id) {
          return id.categoryId;
        })
      };
    });
    return [keys2, values2];
  }

  var ConditionBuilder$1 = new ConditionBuilder();

  var POLLING_DURATION = 1000;

  var _condition = /*#__PURE__*/new WeakMap();

  var _ROOT$e = /*#__PURE__*/new WeakMap();

  var _LABELS = /*#__PURE__*/new WeakMap();

  var _make = /*#__PURE__*/new WeakSet();

  var StackingConditionView = /*#__PURE__*/function () {
    // #isRange;

    /**
     * 
     * @param {HTMLElement} container 
     * @param {String} type: 'property' or 'value'
     * @param {keyCondition, valuesCondition} condition 
     */
    function StackingConditionView(_container, type, condition) {
      var _this = this;

      _classCallCheck(this, StackingConditionView);

      _classPrivateMethodInitSpec(this, _make);

      _classPrivateFieldInitSpec(this, _condition, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _ROOT$e, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _LABELS, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(this, _condition, condition);

      var attribute = Records$1.getAttribute(condition.attributeId); // this.#isRange = isRange;
      // attributes

      _classPrivateFieldSet(this, _ROOT$e, document.createElement('div'));

      _classPrivateFieldGet(this, _ROOT$e).classList.add('stacking-condition-view');

      _classPrivateFieldGet(this, _ROOT$e).dataset.catexxxgoryId = condition.catexxxgoryId;
      _classPrivateFieldGet(this, _ROOT$e).dataset.attributeId = condition.attributeId;
      if (condition.parentCategoryId) _classPrivateFieldGet(this, _ROOT$e).dataset.parentCategoryId = condition.parentCategoryId; // make view

      var _label,
          _ancestorLabels = [Records$1.getCatexxxgory(condition.catexxxgoryId).label];

      switch (true) {
        case _classPrivateFieldGet(this, _condition) instanceof KeyCondition:
          {
            if (condition.parentCategoryId) {
              var getValue = function getValue() {
                var value = condition.value;

                if (value) {
                  _label = "<div class=\"label _catexxxgory-color\">".concat(value.label, "</div>");

                  _ancestorLabels.push.apply(_ancestorLabels, [attribute.label].concat(_toConsumableArray(condition.ancestors.map(function (ancestor) {
                    return Records$1.getValue(condition.attributeId, ancestor).label;
                  }))));

                  _classPrivateMethodGet(_this, _make, _make2).call(_this, _container, type, _ancestorLabels, _label);
                } else {
                  setTimeout(getValue, POLLING_DURATION);
                }
              };

              getValue();
            } else {
              _label = "<div class=\"label _catexxxgory-color\">".concat(attribute.label, "</div>");

              _classPrivateMethodGet(this, _make, _make2).call(this, _container, type, _ancestorLabels, _label);
            }
          }
          break;

        case _classPrivateFieldGet(this, _condition) instanceof ValuesCondition:
          _label = "<ul class=\"labels\"></ul>";

          _ancestorLabels.push(attribute.label);

          _classPrivateMethodGet(this, _make, _make2).call(this, _container, type, _ancestorLabels, _label);

          break;
      } // TODO: クリックイベントで当該要素を表示する

    } // private methods


    _createClass(StackingConditionView, [{
      key: "addValue",
      value: // public methods
      function addValue(categoryId) {
        var _this2 = this;

        var getValue = function getValue() {
          var value = Records$1.getValue(_classPrivateFieldGet(_this2, _condition).attributeId, categoryId);

          if (value === undefined) {
            setTimeout(getValue, POLLING_DURATION);
          } else {
            _classPrivateFieldGet(_this2, _LABELS).insertAdjacentHTML('beforeend', "<li class=\"label _catexxxgory-background-color\" data-category-id=\"".concat(value.categoryId, "\">").concat(value.label, "<div class=\"close-button-view\"></div></li>")); // attach event


            _classPrivateFieldGet(_this2, _LABELS).querySelector(':scope > .label:last-child').addEventListener('click', function (e) {
              e.stopPropagation();
              ConditionBuilder$1.removeAttributeValue(_classPrivateFieldGet(_this2, _condition).attributeId, e.target.parentNode.dataset.categoryId);
            });
          }
        };

        getValue();
      }
    }, {
      key: "removeAttribute",
      value: function removeAttribute(keyCondition) {
        var isMatch = keyCondition.attributeId === _classPrivateFieldGet(this, _condition).attributeId && (keyCondition.parentCategoryId ? keyCondition.parentCategoryId === _classPrivateFieldGet(this, _condition).parentCategoryId : true);
        if (isMatch) _classPrivateFieldGet(this, _ROOT$e).parentNode.removeChild(_classPrivateFieldGet(this, _ROOT$e));
        return isMatch;
      }
    }, {
      key: "removeAttributeValue",
      value: function removeAttributeValue(attributeId, categoryId) {
        if (attributeId === _classPrivateFieldGet(this, _condition).attributeId) {
          _classPrivateFieldGet(this, _LABELS).removeChild(_classPrivateFieldGet(this, _LABELS).querySelector(":scope > [data-category-id=\"".concat(categoryId, "\"")));

          if (_classPrivateFieldGet(this, _LABELS).childNodes.length === 0) {
            _classPrivateFieldGet(this, _ROOT$e).parentNode.removeChild(_classPrivateFieldGet(this, _ROOT$e));

            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    }, {
      key: "sameAttribute",
      value: function sameAttribute(attributeId) {
        return attributeId === _classPrivateFieldGet(this, _condition).attributeId;
      }
    }]);

    return StackingConditionView;
  }();

  function _make2(container, type, ancestorLabels, label) {
    var _this3 = this;

    _classPrivateFieldGet(this, _ROOT$e).innerHTML = "\n    <div class=\"close-button-view\"></div>\n    <ul class=\"path\">\n      ".concat(ancestorLabels.map(function (ancestor) {
      return "<li>".concat(ancestor, "</li>");
    }).join(''), "\n    </ul>\n    ").concat(label);
    container.insertAdjacentElement('beforeend', _classPrivateFieldGet(this, _ROOT$e)); // reference

    if (_classPrivateFieldGet(this, _condition) instanceof ValuesCondition) {
      _classPrivateFieldSet(this, _LABELS, _classPrivateFieldGet(this, _ROOT$e).querySelector(':scope > .labels'));

      var _iterator = _createForOfIteratorHelper(_classPrivateFieldGet(this, _condition).categoryIds),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var categoryId = _step.value;
          this.addValue(categoryId);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } // event


    _classPrivateFieldGet(this, _ROOT$e).querySelector(':scope > .close-button-view').addEventListener('click', function () {
      switch (true) {
        case _classPrivateFieldGet(_this3, _condition) instanceof KeyCondition:
          // notify
          ConditionBuilder$1.removeAttribute(_classPrivateFieldGet(_this3, _condition).attributeId, _classPrivateFieldGet(_this3, _condition).parentCategoryId);
          break;

        case _classPrivateFieldGet(_this3, _condition) instanceof ValuesCondition:
          var _iterator2 = _createForOfIteratorHelper(_classPrivateFieldGet(_this3, _LABELS).querySelectorAll(':scope > .label')),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _label2 = _step2.value;
              ConditionBuilder$1.removeAttributeValue(_classPrivateFieldGet(_this3, _condition).attributeId, _label2.dataset.categoryId);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          break;
      }
    });
  }

  var _properties = /*#__PURE__*/new WeakMap();

  var _propertyValues = /*#__PURE__*/new WeakMap();

  var _isDefined = /*#__PURE__*/new WeakMap();

  var _placeHolderExamples = /*#__PURE__*/new WeakMap();

  var _TOGO_KEYS = /*#__PURE__*/new WeakMap();

  var _USER_IDS$1 = /*#__PURE__*/new WeakMap();

  var _PROPERTIES_CONDITIONS_CONTAINER = /*#__PURE__*/new WeakMap();

  var _ATTRIBUTES_CONDITIONS_CONTAINER = /*#__PURE__*/new WeakMap();

  var _EXEC_BUTTON = /*#__PURE__*/new WeakMap();

  var _defineTogoKeys = /*#__PURE__*/new WeakSet();

  var _addAttribute = /*#__PURE__*/new WeakSet();

  var _removeAttribute = /*#__PURE__*/new WeakSet();

  var _addAttributeValue = /*#__PURE__*/new WeakSet();

  var _removeAttributeValue = /*#__PURE__*/new WeakSet();

  var ConditionBuilderView = /*#__PURE__*/_createClass(function ConditionBuilderView(elm) {
    var _this = this;

    _classCallCheck(this, ConditionBuilderView);

    _classPrivateMethodInitSpec(this, _removeAttributeValue);

    _classPrivateMethodInitSpec(this, _addAttributeValue);

    _classPrivateMethodInitSpec(this, _removeAttribute);

    _classPrivateMethodInitSpec(this, _addAttribute);

    _classPrivateMethodInitSpec(this, _defineTogoKeys);

    _classPrivateFieldInitSpec(this, _properties, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _propertyValues, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _isDefined, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _placeHolderExamples, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _TOGO_KEYS, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _USER_IDS$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _PROPERTIES_CONDITIONS_CONTAINER, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _ATTRIBUTES_CONDITIONS_CONTAINER, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _EXEC_BUTTON, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _properties, []);

    _classPrivateFieldSet(this, _propertyValues, []);

    _classPrivateFieldSet(this, _isDefined, false); // references


    var conditionsContainer = elm.querySelector(':scope > .conditions');

    _classPrivateFieldSet(this, _TOGO_KEYS, conditionsContainer.querySelector('#ConditionTogoKey > .inner > select'));

    _classPrivateFieldSet(this, _USER_IDS$1, elm.querySelector('#UploadUserIDsView > textarea'));

    _classPrivateFieldSet(this, _PROPERTIES_CONDITIONS_CONTAINER, document.querySelector('#ConditionValues > .inner > .conditions'));

    _classPrivateFieldSet(this, _ATTRIBUTES_CONDITIONS_CONTAINER, document.querySelector('#ConditionKeys > .inner > .conditions'));

    _classPrivateFieldSet(this, _EXEC_BUTTON, elm.querySelector(':scope > footer > button.exec')); // attach event


    document.querySelector('#ConditionKeys').addEventListener('click', function () {
      return document.body.dataset.condition = 'value';
    });
    document.querySelector('#ConditionValues').addEventListener('click', function () {
      return document.body.dataset.condition = 'key';
    });

    _classPrivateFieldGet(this, _EXEC_BUTTON).addEventListener('click', function () {
      document.body.dataset.display = 'results';
      ConditionBuilder$1.makeQueryParameter();
    });

    elm.querySelector(':scope > footer > button.return').addEventListener('click', function () {
      document.body.dataset.display = 'properties';
    });
    elm.querySelector(':scope > header > button.rounded-button-view').addEventListener('click', function () {
      var customEvent = new CustomEvent(clearCondition);
      DefaultEventEmitter$1.dispatchEvent(customEvent);
    }); // event listeners

    DefaultEventEmitter$1.addEventListener(mutateAttributeCondition, function (_ref) {
      var _ref$detail = _ref.detail,
          action = _ref$detail.action,
          keyCondition = _ref$detail.keyCondition;

      switch (action) {
        case 'add':
          _classPrivateMethodGet(_this, _addAttribute, _addAttribute2).call(_this, keyCondition);

          break;

        case 'remove':
          _classPrivateMethodGet(_this, _removeAttribute, _removeAttribute2).call(_this, keyCondition);

          break;
      }
    });
    DefaultEventEmitter$1.addEventListener(mutateAttributeValueCondition, function (_ref2) {
      var _ref2$detail = _ref2.detail,
          action = _ref2$detail.action,
          attributeId = _ref2$detail.attributeId,
          categoryId = _ref2$detail.categoryId;

      switch (action) {
        case 'add':
          _classPrivateMethodGet(_this, _addAttributeValue, _addAttributeValue2).call(_this, attributeId, categoryId);

          break;

        case 'remove':
          _classPrivateMethodGet(_this, _removeAttributeValue, _removeAttributeValue2).call(_this, attributeId, categoryId);

          break;
      }
    });
    DefaultEventEmitter$1.addEventListener(defineTogoKey, _classPrivateMethodGet(this, _defineTogoKeys, _defineTogoKeys2).bind(this));
    DefaultEventEmitter$1.addEventListener(mutateEstablishConditions, function (e) {
      _classPrivateFieldGet(_this, _EXEC_BUTTON).disabled = !e.detail;
    });
  } // private methods
  );

  function _defineTogoKeys2(_ref3) {
    var _this2 = this;

    var datasets = _ref3.detail.datasets;

    _classPrivateFieldSet(this, _isDefined, true);

    _classPrivateFieldSet(this, _placeHolderExamples, Object.fromEntries(Object.keys(datasets).map(function (key) {
      return [key, datasets[key].examples];
    }))); // make options


    _classPrivateFieldGet(this, _TOGO_KEYS).innerHTML = Object.keys(datasets).filter(function (key) {
      return datasets[key].target;
    }).map(function (key) {
      return "<option value=\"".concat(key, "\">").concat(datasets[key].label, "</option>");
    }).join('');
    _classPrivateFieldGet(this, _TOGO_KEYS).disabled = false;
    _classPrivateFieldGet(this, _TOGO_KEYS).value = ConditionBuilder$1.currentTogoKey; // attach event

    _classPrivateFieldGet(this, _TOGO_KEYS).addEventListener('change', function (e) {
      ConditionBuilder$1.setSubject(e.target.value);
      _classPrivateFieldGet(_this2, _USER_IDS$1).placeholder = "e.g. ".concat(_classPrivateFieldGet(_this2, _placeHolderExamples)[e.target.value].join(', '));
    }); // preset


    var togoKey = ConditionBuilder$1.currentTogoKey;

    if (togoKey && Array.from(_classPrivateFieldGet(this, _TOGO_KEYS).options).map(function (option) {
      return option.value;
    }).indexOf(togoKey) !== -1) {
      _classPrivateFieldGet(this, _TOGO_KEYS).value = togoKey;
    } else {
      _classPrivateFieldGet(this, _TOGO_KEYS).options[0].selected = true;
    }

    _classPrivateFieldGet(this, _TOGO_KEYS).dispatchEvent(new Event('change'));
  }

  function _addAttribute2(keyCondition) {
    // modifier
    _classPrivateFieldGet(this, _PROPERTIES_CONDITIONS_CONTAINER).classList.remove('-empty'); // make view


    _classPrivateFieldGet(this, _properties).push(new StackingConditionView(_classPrivateFieldGet(this, _PROPERTIES_CONDITIONS_CONTAINER), 'key', keyCondition));
  }

  function _removeAttribute2(keyCondition) {
    // remove from array
    var index = _classPrivateFieldGet(this, _properties).findIndex(function (stackingConditionView) {
      return stackingConditionView.removeAttribute(keyCondition);
    });

    _classPrivateFieldGet(this, _properties).splice(index, 1); // modifier


    if (_classPrivateFieldGet(this, _properties).length === 0) _classPrivateFieldGet(this, _PROPERTIES_CONDITIONS_CONTAINER).classList.add('-empty');
  }

  function _addAttributeValue2(attributeId, categoryId) {
    // modifier
    _classPrivateFieldGet(this, _ATTRIBUTES_CONDITIONS_CONTAINER).classList.remove('-empty'); // find a condition view has same attribute id


    var stackingConditionView = _classPrivateFieldGet(this, _propertyValues).find(function (stackingConditionView) {
      return stackingConditionView.sameAttribute(attributeId);
    });

    if (stackingConditionView) {
      // if it exists, add new categoryId
      stackingConditionView.addValue(categoryId);
    } else {
      // otherwise, make new condition view
      _classPrivateFieldGet(this, _propertyValues).push(new StackingConditionView(_classPrivateFieldGet(this, _ATTRIBUTES_CONDITIONS_CONTAINER), 'value', new ValuesCondition(attributeId, [categoryId])));
    }
  }

  function _removeAttributeValue2(attributeId, categoryId) {
    // remove from array
    var index = _classPrivateFieldGet(this, _propertyValues).findIndex(function (stackingConditionView) {
      return stackingConditionView.removeAttributeValue(attributeId, categoryId);
    });

    if (index !== -1) _classPrivateFieldGet(this, _propertyValues).splice(index, 1); // modifier

    if (_classPrivateFieldGet(this, _propertyValues).length === 0) _classPrivateFieldGet(this, _ATTRIBUTES_CONDITIONS_CONTAINER).classList.add('-empty');
  }

  function collapseView(elm) {
    var button = elm.querySelector(".collapsebutton[data-collapse=\"".concat(elm.dataset.collapse, "\"]"));
    var content = elm.querySelector(".collapsingcontent[data-collapse=\"".concat(elm.dataset.collapse, "\"]"));
    button.addEventListener('click', function () {
      elm.classList.toggle('-spread');
      button.classList.toggle('-spread');
      content.classList.toggle('-spread'); // messaging

      content.querySelectorAll('[data-capturing-collapse=true]').forEach(function (node) {
        node.dispatchEvent(new CustomEvent(collapsed, {
          detail: content.classList.contains('-spread')
        }));
      });
    });
  }

  var _label = /*#__PURE__*/new WeakMap();

  var _count = /*#__PURE__*/new WeakMap();

  var _categoryId = /*#__PURE__*/new WeakMap();

  var _index$1 = /*#__PURE__*/new WeakMap();

  var _ROOT$d = /*#__PURE__*/new WeakMap();

  var _INPUT_VALUE = /*#__PURE__*/new WeakMap();

  var _INPUT_KEY = /*#__PURE__*/new WeakMap();

  var _clearUserValues = /*#__PURE__*/new WeakSet();

  var ColumnItemView = /*#__PURE__*/function () {
    function ColumnItemView(column, _ref, index, selectedCategoryIds) {
      var _this = this;

      var count = _ref.count,
          categoryId = _ref.categoryId,
          hasChild = _ref.hasChild,
          label = _ref.label;

      _classCallCheck(this, ColumnItemView);

      _classPrivateMethodInitSpec(this, _clearUserValues);

      _classPrivateFieldInitSpec(this, _label, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _count, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _categoryId, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _index$1, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _ROOT$d, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _INPUT_VALUE, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _INPUT_KEY, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(this, _label, label);

      _classPrivateFieldSet(this, _count, count);

      _classPrivateFieldSet(this, _categoryId, categoryId);

      _classPrivateFieldSet(this, _index$1, index); // make HTML


      _classPrivateFieldSet(this, _ROOT$d, document.createElement('tr'));

      _classPrivateFieldGet(this, _ROOT$d).classList.add('item');

      if (hasChild) _classPrivateFieldGet(this, _ROOT$d).classList.add('-haschild');
      _classPrivateFieldGet(this, _ROOT$d).dataset.id = categoryId;
      _classPrivateFieldGet(this, _ROOT$d).dataset.count = count;
      _classPrivateFieldGet(this, _ROOT$d).innerHTML = "\n    <td class=\"label\">\n      <label class=\"key\">\n        <input type=\"checkbox\" value=\"".concat(categoryId, "\"").concat(hasChild ? '' : ' disabled', "/>\n        ").concat(label, "\n      </label>\n      <label class=\"value\">\n        <input type=\"checkbox\" value=\"").concat(categoryId, "\"/>\n        ").concat(label, "\n      </label>\n    </td>\n    <td class=\"total\">").concat(count.toLocaleString(), "</td>\n    <td class=\"mapped\"></td>\n    <td class=\"pvalue\"></td>\n    <td class=\"drilldown\"></td>");

      _classPrivateFieldSet(this, _INPUT_VALUE, _classPrivateFieldGet(this, _ROOT$d).querySelector(':scope > td.label > label.value > input'));

      _classPrivateFieldSet(this, _INPUT_KEY, _classPrivateFieldGet(this, _ROOT$d).querySelector(':scope > td.label > label.key > input'));

      if (selectedCategoryIds.keys.indexOf(categoryId) !== -1) _classPrivateFieldGet(this, _INPUT_KEY).checked = true;
      if (selectedCategoryIds.values.indexOf(categoryId) !== -1) _classPrivateFieldGet(this, _INPUT_VALUE).checked = true; // even listener

      _classPrivateFieldGet(this, _INPUT_KEY).addEventListener('change', function (e) {
        if (e.target.checked) {
          ConditionBuilder$1.addAttribute(column.attributeId, categoryId);
        } else {
          ConditionBuilder$1.removeAttribute(column.attributeId, categoryId);
        }
      });

      DefaultEventEmitter$1.addEventListener(mutateAttributeCondition, function (_ref2) {
        var _ref2$detail = _ref2.detail,
            action = _ref2$detail.action,
            keyCondition = _ref2$detail.keyCondition;

        if (action === 'remove') {
          if (column.attributeId === keyCondition.attributeId) {
            if (keyCondition.parentCategoryId && categoryId === keyCondition.parentCategoryId) {
              _classPrivateFieldGet(_this, _INPUT_KEY).checked = action === 'add';
            }
          }
        }
      });
      DefaultEventEmitter$1.addEventListener(mutateAttributeValueCondition, function (_ref3) {
        var detail = _ref3.detail;

        if (column.attributeId === detail.attributeId && categoryId === detail.categoryId) {
          _classPrivateFieldGet(_this, _INPUT_VALUE).checked = detail.action === 'add';
        }
      });
      DefaultEventEmitter$1.addEventListener(setUserValues, function (_ref4) {
        var _ref4$detail = _ref4.detail,
            attributeId = _ref4$detail.attributeId,
            values = _ref4$detail.values;
        if (column.attributeId === attributeId) _this.setUserValues(values);
      });
      DefaultEventEmitter$1.addEventListener(clearUserValues, _classPrivateMethodGet(this, _clearUserValues, _clearUserValues2).bind(this)); // select/deselect a item (attribute) > label

      _classPrivateFieldGet(this, _INPUT_VALUE).addEventListener('click', column.checkValue.bind(column)); // drill down


      if (hasChild) {
        var drilldown = _classPrivateFieldGet(this, _ROOT$d).querySelector(':scope > .drilldown');

        drilldown.addEventListener('click', column.drillDown.bind(column));
      }
    } // private methods


    _createClass(ColumnItemView, [{
      key: "update",
      value: // public methods
      function update(color, isLog10, max) {
        var count = isLog10 ? Math.log10(_classPrivateFieldGet(this, _count)) : _classPrivateFieldGet(this, _count);
        _classPrivateFieldGet(this, _ROOT$d).style.backgroundColor = "rgb(".concat(color.mix(App$1.colorWhite, 1 - count / max).coords.map(function (cood) {
          return cood * 256;
        }).join(','), ")");
      }
    }, {
      key: "setUserValues",
      value: function setUserValues(values) {
        var _this2 = this;

        var value = values.find(function (value) {
          return value.categoryId === _classPrivateFieldGet(_this2, _categoryId);
        });

        if (value) {
          _classPrivateFieldGet(this, _ROOT$d).classList.add('-pinsticking');

          _classPrivateFieldGet(this, _ROOT$d).querySelector(':scope > .mapped').textContent = value.hit_count ? value.hit_count.toLocaleString() : '';
          _classPrivateFieldGet(this, _ROOT$d).querySelector(':scope > .pvalue').textContent = value.pValue ? value.pValue.toExponential(2) : '';
          if (value.hit_count === 0) _classPrivateFieldGet(this, _ROOT$d).classList.remove('-pinsticking');else _classPrivateFieldGet(this, _ROOT$d).classList.add('-pinsticking');
        }
      } // accessors

    }, {
      key: "label",
      get: function get() {
        return _classPrivateFieldGet(this, _label);
      }
    }, {
      key: "count",
      get: function get() {
        return _classPrivateFieldGet(this, _count);
      }
    }, {
      key: "index",
      get: function get() {
        return _classPrivateFieldGet(this, _index$1);
      }
    }, {
      key: "categoryId",
      get: function get() {
        return _classPrivateFieldGet(this, _categoryId);
      }
    }, {
      key: "rootNode",
      get: function get() {
        return _classPrivateFieldGet(this, _ROOT$d);
      }
    }]);

    return ColumnItemView;
  }();

  function _clearUserValues2() {
    _classPrivateFieldGet(this, _ROOT$d).classList.remove('-pinsticking');
  }

  var SORTABLE_COLUMNS = ['label', 'total'];

  var _status = /*#__PURE__*/new WeakMap();

  var _setDocument = /*#__PURE__*/new WeakSet();

  var ColumnSelectorSortManager = /*#__PURE__*/function () {
    function ColumnSelectorSortManager() {
      _classCallCheck(this, ColumnSelectorSortManager);

      _classPrivateMethodInitSpec(this, _setDocument);

      _classPrivateFieldInitSpec(this, _status, {
        writable: true,
        value: void 0
      });

      // get data from local strage
      var _column = window.localStorage.getItem('sortColumn');

      var status = window.localStorage.getItem('sortDirectionEachOfColumns');

      if (status) {
        _classPrivateFieldSet(this, _status, new Map(JSON.parse(status)));
      } else {
        _classPrivateFieldSet(this, _status, new Map(SORTABLE_COLUMNS.map(function (column) {
          return [column, ''];
        })));
      }

      _classPrivateMethodGet(this, _setDocument, _setDocument2).call(this, _column);
    } // private methods


    _createClass(ColumnSelectorSortManager, [{
      key: "setSort",
      value: // public methods
      function setSort(column) {
        // set sort
        var direction = {
          '': 'asc',
          asc: 'desc',
          desc: ''
        }[_classPrivateFieldGet(this, _status).get(column)];

        _classPrivateFieldGet(this, _status).set(column, direction);

        _classPrivateMethodGet(this, _setDocument, _setDocument2).call(this, column); // dispatch event


        var customEvent = new CustomEvent(changeColumnSelectorSorter, {
          detail: {
            column: column,
            direction: direction
          }
        });
        DefaultEventEmitter$1.dispatchEvent(customEvent); // set local storage

        window.localStorage.setItem('sortColumn', column);
        window.localStorage.setItem('sortDirectionEachOfColumns', JSON.stringify(Array.from(_classPrivateFieldGet(this, _status))));
      } // accessors

    }, {
      key: "sortableColumns",
      get: function get() {
        return SORTABLE_COLUMNS;
      }
    }, {
      key: "sortDescriptor",
      get: function get() {
        var column = document.body.dataset.sortDirection === '' ? '' : document.body.dataset.sortColumn;
        var direction = document.body.dataset.sortDirection;
        return {
          column: column,
          direction: direction
        };
      }
    }]);

    return ColumnSelectorSortManager;
  }();

  function _setDocument2(column) {
    document.body.dataset.sortColumn = column;
    document.body.dataset.sortDirection = _classPrivateFieldGet(this, _status).get(column);
  }

  var ColumnSelectorSortManager$1 = new ColumnSelectorSortManager();

  var noprocessing = function noprocessing(parameter) {
    return parameter;
  };

  var stringify = function stringify(parameter) {
    return JSON.stringify(parameter);
  };

  var QUERY_TEMPRATES = {
    locate: {
      attribute: noprocessing,
      ndoe: noprocessing,
      dataset: noprocessing,
      queries: stringify
    },
    aggregate: {
      dataset: noprocessing,
      filters: stringify,
      queries: stringify
    },
    dataframe: {
      dataset: noprocessing,
      filters: stringify,
      annotations: stringify,
      queries: stringify
    }
  };
  function getApiParameter(api, parameters) {
    var template = QUERY_TEMPRATES[api];
    var map = Object.keys(template).map(function (key) {
      return [key, template[key](parameters[key])];
    });
    return Object.fromEntries(map);
  }

  var axios$2 = {exports: {}};

  var bind$2 = function bind(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };

  var bind$1 = bind$2;

  // utils is a library of generic helper functions non-specific to axios

  var toString = Object.prototype.toString;

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Array, otherwise false
   */
  function isArray(val) {
    return Array.isArray(val);
  }

  /**
   * Determine if a value is undefined
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if the value is undefined, otherwise false
   */
  function isUndefined(val) {
    return typeof val === 'undefined';
  }

  /**
   * Determine if a value is a Buffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Buffer, otherwise false
   */
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
      && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
  }

  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */
  function isArrayBuffer(val) {
    return toString.call(val) === '[object ArrayBuffer]';
  }

  /**
   * Determine if a value is a FormData
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  function isFormData(val) {
    return toString.call(val) === '[object FormData]';
  }

  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */
  function isArrayBufferView(val) {
    var result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
      result = ArrayBuffer.isView(val);
    } else {
      result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
    }
    return result;
  }

  /**
   * Determine if a value is a String
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a String, otherwise false
   */
  function isString(val) {
    return typeof val === 'string';
  }

  /**
   * Determine if a value is a Number
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Number, otherwise false
   */
  function isNumber(val) {
    return typeof val === 'number';
  }

  /**
   * Determine if a value is an Object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Object, otherwise false
   */
  function isObject(val) {
    return val !== null && typeof val === 'object';
  }

  /**
   * Determine if a value is a plain Object
   *
   * @param {Object} val The value to test
   * @return {boolean} True if value is a plain Object, otherwise false
   */
  function isPlainObject(val) {
    if (toString.call(val) !== '[object Object]') {
      return false;
    }

    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
  }

  /**
   * Determine if a value is a Date
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Date, otherwise false
   */
  function isDate(val) {
    return toString.call(val) === '[object Date]';
  }

  /**
   * Determine if a value is a File
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a File, otherwise false
   */
  function isFile(val) {
    return toString.call(val) === '[object File]';
  }

  /**
   * Determine if a value is a Blob
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Blob, otherwise false
   */
  function isBlob(val) {
    return toString.call(val) === '[object Blob]';
  }

  /**
   * Determine if a value is a Function
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */
  function isFunction(val) {
    return toString.call(val) === '[object Function]';
  }

  /**
   * Determine if a value is a Stream
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Stream, otherwise false
   */
  function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
  }

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  function isURLSearchParams(val) {
    return toString.call(val) === '[object URLSearchParams]';
  }

  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   * @returns {String} The String freed of excess whitespace
   */
  function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
  }

  /**
   * Determine if we're running in a standard browser environment
   *
   * This allows axios to run in a web worker, and react-native.
   * Both environments support XMLHttpRequest, but not fully standard globals.
   *
   * web workers:
   *  typeof window -> undefined
   *  typeof document -> undefined
   *
   * react-native:
   *  navigator.product -> 'ReactNative'
   * nativescript
   *  navigator.product -> 'NativeScript' or 'NS'
   */
  function isStandardBrowserEnv() {
    if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                             navigator.product === 'NativeScript' ||
                                             navigator.product === 'NS')) {
      return false;
    }
    return (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined'
    );
  }

  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   */
  function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }

  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */
  function merge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (isPlainObject(result[key]) && isPlainObject(val)) {
        result[key] = merge(result[key], val);
      } else if (isPlainObject(val)) {
        result[key] = merge({}, val);
      } else if (isArray(val)) {
        result[key] = val.slice();
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   * @return {Object} The resulting value of object a
   */
  function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === 'function') {
        a[key] = bind$1(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }

  /**
   * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
   *
   * @param {string} content with BOM
   * @return {string} content value without BOM
   */
  function stripBOM(content) {
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
    return content;
  }

  var utils$e = {
    isArray: isArray,
    isArrayBuffer: isArrayBuffer,
    isBuffer: isBuffer,
    isFormData: isFormData,
    isArrayBufferView: isArrayBufferView,
    isString: isString,
    isNumber: isNumber,
    isObject: isObject,
    isPlainObject: isPlainObject,
    isUndefined: isUndefined,
    isDate: isDate,
    isFile: isFile,
    isBlob: isBlob,
    isFunction: isFunction,
    isStream: isStream,
    isURLSearchParams: isURLSearchParams,
    isStandardBrowserEnv: isStandardBrowserEnv,
    forEach: forEach,
    merge: merge,
    extend: extend,
    trim: trim,
    stripBOM: stripBOM
  };

  var utils$d = utils$e;

  function encode(val) {
    return encodeURIComponent(val).
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+').
      replace(/%5B/gi, '[').
      replace(/%5D/gi, ']');
  }

  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @returns {string} The formatted url
   */
  var buildURL$2 = function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }

    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils$d.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];

      utils$d.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === 'undefined') {
          return;
        }

        if (utils$d.isArray(val)) {
          key = key + '[]';
        } else {
          val = [val];
        }

        utils$d.forEach(val, function parseValue(v) {
          if (utils$d.isDate(v)) {
            v = v.toISOString();
          } else if (utils$d.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + '=' + encode(v));
        });
      });

      serializedParams = parts.join('&');
    }

    if (serializedParams) {
      var hashmarkIndex = url.indexOf('#');
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  };

  var utils$c = utils$e;

  function InterceptorManager$1() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  InterceptorManager$1.prototype.use = function use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  };

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   */
  InterceptorManager$1.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   */
  InterceptorManager$1.prototype.forEach = function forEach(fn) {
    utils$c.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };

  var InterceptorManager_1 = InterceptorManager$1;

  var utils$b = utils$e;

  var normalizeHeaderName$1 = function normalizeHeaderName(headers, normalizedName) {
    utils$b.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };

  /**
   * Update an Error with the specified config, error code, and response.
   *
   * @param {Error} error The error to update.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The error.
   */
  var enhanceError$2 = function enhanceError(error, config, code, request, response) {
    error.config = config;
    if (code) {
      error.code = code;
    }

    error.request = request;
    error.response = response;
    error.isAxiosError = true;

    error.toJSON = function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code,
        status: this.response && this.response.status ? this.response.status : null
      };
    };
    return error;
  };

  var enhanceError$1 = enhanceError$2;

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The created error.
   */
  var createError$2 = function createError(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError$1(error, config, code, request, response);
  };

  var createError$1 = createError$2;

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   */
  var settle$1 = function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError$1(
        'Request failed with status code ' + response.status,
        response.config,
        null,
        response.request,
        response
      ));
    }
  };

  var utils$a = utils$e;

  var cookies$1 = (
    utils$a.isStandardBrowserEnv() ?

    // Standard browser envs support document.cookie
      (function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils$a.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils$a.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils$a.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return (match ? decodeURIComponent(match[3]) : null);
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      })() :

    // Non standard browser env (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() { return null; },
          remove: function remove() {}
        };
      })()
  );

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */
  var isAbsoluteURL$1 = function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  };

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   * @returns {string} The combined URL
   */
  var combineURLs$1 = function combineURLs(baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
  };

  var isAbsoluteURL = isAbsoluteURL$1;
  var combineURLs = combineURLs$1;

  /**
   * Creates a new URL by combining the baseURL with the requestedURL,
   * only when the requestedURL is not already an absolute URL.
   * If the requestURL is absolute, this function returns the requestedURL untouched.
   *
   * @param {string} baseURL The base URL
   * @param {string} requestedURL Absolute or relative URL to combine
   * @returns {string} The combined full path
   */
  var buildFullPath$1 = function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  };

  var utils$9 = utils$e;

  // Headers whose duplicates are ignored by node
  // c.f. https://nodejs.org/api/http.html#http_message_headers
  var ignoreDuplicateOf = [
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
  ];

  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} headers Headers needing to be parsed
   * @returns {Object} Headers parsed into an object
   */
  var parseHeaders$1 = function parseHeaders(headers) {
    var parsed = {};
    var key;
    var val;
    var i;

    if (!headers) { return parsed; }

    utils$9.forEach(headers.split('\n'), function parser(line) {
      i = line.indexOf(':');
      key = utils$9.trim(line.substr(0, i)).toLowerCase();
      val = utils$9.trim(line.substr(i + 1));

      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === 'set-cookie') {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      }
    });

    return parsed;
  };

  var utils$8 = utils$e;

  var isURLSameOrigin$1 = (
    utils$8.isStandardBrowserEnv() ?

    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
      (function standardBrowserEnv() {
        var msie = /(msie|trident)/i.test(navigator.userAgent);
        var urlParsingNode = document.createElement('a');
        var originURL;

        /**
      * Parse a URL to discover it's components
      *
      * @param {String} url The URL to be parsed
      * @returns {Object}
      */
        function resolveURL(url) {
          var href = url;

          if (msie) {
          // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute('href', href);
            href = urlParsingNode.href;
          }

          urlParsingNode.setAttribute('href', href);

          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
              urlParsingNode.pathname :
              '/' + urlParsingNode.pathname
          };
        }

        originURL = resolveURL(window.location.href);

        /**
      * Determine if a URL shares the same origin as the current location
      *
      * @param {String} requestURL The URL to test
      * @returns {boolean} True if URL shares the same origin, otherwise false
      */
        return function isURLSameOrigin(requestURL) {
          var parsed = (utils$8.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
          return (parsed.protocol === originURL.protocol &&
              parsed.host === originURL.host);
        };
      })() :

    // Non standard browser envs (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      })()
  );

  /**
   * A `Cancel` is an object that is thrown when an operation is canceled.
   *
   * @class
   * @param {string=} message The message.
   */
  function Cancel$3(message) {
    this.message = message;
  }

  Cancel$3.prototype.toString = function toString() {
    return 'Cancel' + (this.message ? ': ' + this.message : '');
  };

  Cancel$3.prototype.__CANCEL__ = true;

  var Cancel_1 = Cancel$3;

  var utils$7 = utils$e;
  var settle = settle$1;
  var cookies = cookies$1;
  var buildURL$1 = buildURL$2;
  var buildFullPath = buildFullPath$1;
  var parseHeaders = parseHeaders$1;
  var isURLSameOrigin = isURLSameOrigin$1;
  var createError = createError$2;
  var defaults$4 = defaults_1;
  var Cancel$2 = Cancel_1;

  var xhr = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;
      var responseType = config.responseType;
      var onCanceled;
      function done() {
        if (config.cancelToken) {
          config.cancelToken.unsubscribe(onCanceled);
        }

        if (config.signal) {
          config.signal.removeEventListener('abort', onCanceled);
        }
      }

      if (utils$7.isFormData(requestData)) {
        delete requestHeaders['Content-Type']; // Let the browser set it
      }

      var request = new XMLHttpRequest();

      // HTTP basic authentication
      if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
        requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
      }

      var fullPath = buildFullPath(config.baseURL, config.url);
      request.open(config.method.toUpperCase(), buildURL$1(fullPath, config.params, config.paramsSerializer), true);

      // Set the request timeout in MS
      request.timeout = config.timeout;

      function onloadend() {
        if (!request) {
          return;
        }
        // Prepare the response
        var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
        var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
          request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
          request: request
        };

        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);

        // Clean up request
        request = null;
      }

      if ('onloadend' in request) {
        // Use onloadend if available
        request.onloadend = onloadend;
      } else {
        // Listen for ready state to emulate onloadend
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }

          // The request errored out and we didn't get a response, this will be
          // handled by onerror instead
          // With one exception: request that using file: protocol, most browsers
          // will return status as 0 even though it's a successful request
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
            return;
          }
          // readystate handler is calling before onerror or ontimeout handlers,
          // so we should call onloadend on the next 'tick'
          setTimeout(onloadend);
        };
      }

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(createError('Request aborted', config, 'ECONNABORTED', request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
      request.onerror = function handleError() {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject(createError('Network Error', config, null, request));

        // Clean up request
        request = null;
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
        var transitional = config.transitional || defaults$4.transitional;
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(createError(
          timeoutErrorMessage,
          config,
          transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
          request));

        // Clean up request
        request = null;
      };

      // Add xsrf header
      // This is only done if running in a standard browser environment.
      // Specifically not if we're in a web worker, or react-native.
      if (utils$7.isStandardBrowserEnv()) {
        // Add xsrf header
        var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

        if (xsrfValue) {
          requestHeaders[config.xsrfHeaderName] = xsrfValue;
        }
      }

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils$7.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
            // Remove Content-Type if data is undefined
            delete requestHeaders[key];
          } else {
            // Otherwise add header to the request
            request.setRequestHeader(key, val);
          }
        });
      }

      // Add withCredentials to request if needed
      if (!utils$7.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      }

      // Add responseType to request if needed
      if (responseType && responseType !== 'json') {
        request.responseType = config.responseType;
      }

      // Handle progress if needed
      if (typeof config.onDownloadProgress === 'function') {
        request.addEventListener('progress', config.onDownloadProgress);
      }

      // Not all browsers support upload events
      if (typeof config.onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', config.onUploadProgress);
      }

      if (config.cancelToken || config.signal) {
        // Handle cancellation
        // eslint-disable-next-line func-names
        onCanceled = function(cancel) {
          if (!request) {
            return;
          }
          reject(!cancel || (cancel && cancel.type) ? new Cancel$2('canceled') : cancel);
          request.abort();
          request = null;
        };

        config.cancelToken && config.cancelToken.subscribe(onCanceled);
        if (config.signal) {
          config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
        }
      }

      if (!requestData) {
        requestData = null;
      }

      // Send the request
      request.send(requestData);
    });
  };

  var utils$6 = utils$e;
  var normalizeHeaderName = normalizeHeaderName$1;
  var enhanceError = enhanceError$2;

  var DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  function setContentTypeIfUnset(headers, value) {
    if (!utils$6.isUndefined(headers) && utils$6.isUndefined(headers['Content-Type'])) {
      headers['Content-Type'] = value;
    }
  }

  function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== 'undefined') {
      // For browsers use XHR adapter
      adapter = xhr;
    } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
      // For node use HTTP adapter
      adapter = xhr;
    }
    return adapter;
  }

  function stringifySafely(rawValue, parser, encoder) {
    if (utils$6.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$6.trim(rawValue);
      } catch (e) {
        if (e.name !== 'SyntaxError') {
          throw e;
        }
      }
    }

    return (encoder || JSON.stringify)(rawValue);
  }

  var defaults$3 = {

    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    },

    adapter: getDefaultAdapter(),

    transformRequest: [function transformRequest(data, headers) {
      normalizeHeaderName(headers, 'Accept');
      normalizeHeaderName(headers, 'Content-Type');

      if (utils$6.isFormData(data) ||
        utils$6.isArrayBuffer(data) ||
        utils$6.isBuffer(data) ||
        utils$6.isStream(data) ||
        utils$6.isFile(data) ||
        utils$6.isBlob(data)
      ) {
        return data;
      }
      if (utils$6.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$6.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
        return data.toString();
      }
      if (utils$6.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
        setContentTypeIfUnset(headers, 'application/json');
        return stringifySafely(data);
      }
      return data;
    }],

    transformResponse: [function transformResponse(data) {
      var transitional = this.transitional || defaults$3.transitional;
      var silentJSONParsing = transitional && transitional.silentJSONParsing;
      var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

      if (strictJSONParsing || (forcedJSONParsing && utils$6.isString(data) && data.length)) {
        try {
          return JSON.parse(data);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === 'SyntaxError') {
              throw enhanceError(e, this, 'E_JSON_PARSE');
            }
            throw e;
          }
        }
      }

      return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    maxContentLength: -1,
    maxBodyLength: -1,

    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },

    headers: {
      common: {
        'Accept': 'application/json, text/plain, */*'
      }
    }
  };

  utils$6.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults$3.headers[method] = {};
  });

  utils$6.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults$3.headers[method] = utils$6.merge(DEFAULT_CONTENT_TYPE);
  });

  var defaults_1 = defaults$3;

  var utils$5 = utils$e;
  var defaults$2 = defaults_1;

  /**
   * Transform the data for a request or a response
   *
   * @param {Object|String} data The data to be transformed
   * @param {Array} headers The headers for the request or response
   * @param {Array|Function} fns A single function or Array of functions
   * @returns {*} The resulting transformed data
   */
  var transformData$1 = function transformData(data, headers, fns) {
    var context = this || defaults$2;
    /*eslint no-param-reassign:0*/
    utils$5.forEach(fns, function transform(fn) {
      data = fn.call(context, data, headers);
    });

    return data;
  };

  var isCancel$1 = function isCancel(value) {
    return !!(value && value.__CANCEL__);
  };

  var utils$4 = utils$e;
  var transformData = transformData$1;
  var isCancel = isCancel$1;
  var defaults$1 = defaults_1;
  var Cancel$1 = Cancel_1;

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }

    if (config.signal && config.signal.aborted) {
      throw new Cancel$1('canceled');
    }
  }

  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   * @returns {Promise} The Promise to be fulfilled
   */
  var dispatchRequest$1 = function dispatchRequest(config) {
    throwIfCancellationRequested(config);

    // Ensure headers exist
    config.headers = config.headers || {};

    // Transform request data
    config.data = transformData.call(
      config,
      config.data,
      config.headers,
      config.transformRequest
    );

    // Flatten headers
    config.headers = utils$4.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers
    );

    utils$4.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );

    var adapter = config.adapter || defaults$1.adapter;

    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData.call(
        config,
        response.data,
        response.headers,
        config.transformResponse
      );

      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }

      return Promise.reject(reason);
    });
  };

  var utils$3 = utils$e;

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   * @returns {Object} New object resulting from merging config2 to config1
   */
  var mergeConfig$2 = function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    var config = {};

    function getMergedValue(target, source) {
      if (utils$3.isPlainObject(target) && utils$3.isPlainObject(source)) {
        return utils$3.merge(target, source);
      } else if (utils$3.isPlainObject(source)) {
        return utils$3.merge({}, source);
      } else if (utils$3.isArray(source)) {
        return source.slice();
      }
      return source;
    }

    // eslint-disable-next-line consistent-return
    function mergeDeepProperties(prop) {
      if (!utils$3.isUndefined(config2[prop])) {
        return getMergedValue(config1[prop], config2[prop]);
      } else if (!utils$3.isUndefined(config1[prop])) {
        return getMergedValue(undefined, config1[prop]);
      }
    }

    // eslint-disable-next-line consistent-return
    function valueFromConfig2(prop) {
      if (!utils$3.isUndefined(config2[prop])) {
        return getMergedValue(undefined, config2[prop]);
      }
    }

    // eslint-disable-next-line consistent-return
    function defaultToConfig2(prop) {
      if (!utils$3.isUndefined(config2[prop])) {
        return getMergedValue(undefined, config2[prop]);
      } else if (!utils$3.isUndefined(config1[prop])) {
        return getMergedValue(undefined, config1[prop]);
      }
    }

    // eslint-disable-next-line consistent-return
    function mergeDirectKeys(prop) {
      if (prop in config2) {
        return getMergedValue(config1[prop], config2[prop]);
      } else if (prop in config1) {
        return getMergedValue(undefined, config1[prop]);
      }
    }

    var mergeMap = {
      'url': valueFromConfig2,
      'method': valueFromConfig2,
      'data': valueFromConfig2,
      'baseURL': defaultToConfig2,
      'transformRequest': defaultToConfig2,
      'transformResponse': defaultToConfig2,
      'paramsSerializer': defaultToConfig2,
      'timeout': defaultToConfig2,
      'timeoutMessage': defaultToConfig2,
      'withCredentials': defaultToConfig2,
      'adapter': defaultToConfig2,
      'responseType': defaultToConfig2,
      'xsrfCookieName': defaultToConfig2,
      'xsrfHeaderName': defaultToConfig2,
      'onUploadProgress': defaultToConfig2,
      'onDownloadProgress': defaultToConfig2,
      'decompress': defaultToConfig2,
      'maxContentLength': defaultToConfig2,
      'maxBodyLength': defaultToConfig2,
      'transport': defaultToConfig2,
      'httpAgent': defaultToConfig2,
      'httpsAgent': defaultToConfig2,
      'cancelToken': defaultToConfig2,
      'socketPath': defaultToConfig2,
      'responseEncoding': defaultToConfig2,
      'validateStatus': mergeDirectKeys
    };

    utils$3.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
      var merge = mergeMap[prop] || mergeDeepProperties;
      var configValue = merge(prop);
      (utils$3.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
    });

    return config;
  };

  var data = {
    "version": "0.25.0"
  };

  var VERSION = data.version;

  var validators$1 = {};

  // eslint-disable-next-line func-names
  ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
    validators$1[type] = function validator(thing) {
      return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
    };
  });

  var deprecatedWarnings = {};

  /**
   * Transitional option validator
   * @param {function|boolean?} validator - set to false if the transitional option has been removed
   * @param {string?} version - deprecated version / removed since version
   * @param {string?} message - some message with additional info
   * @returns {function}
   */
  validators$1.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
      return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
    }

    // eslint-disable-next-line func-names
    return function(value, opt, opts) {
      if (validator === false) {
        throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
      }

      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        // eslint-disable-next-line no-console
        console.warn(
          formatMessage(
            opt,
            ' has been deprecated since v' + version + ' and will be removed in the near future'
          )
        );
      }

      return validator ? validator(value, opt, opts) : true;
    };
  };

  /**
   * Assert object's properties type
   * @param {object} options
   * @param {object} schema
   * @param {boolean?} allowUnknown
   */

  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    var keys = Object.keys(options);
    var i = keys.length;
    while (i-- > 0) {
      var opt = keys[i];
      var validator = schema[opt];
      if (validator) {
        var value = options[opt];
        var result = value === undefined || validator(value, opt, options);
        if (result !== true) {
          throw new TypeError('option ' + opt + ' must be ' + result);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw Error('Unknown option ' + opt);
      }
    }
  }

  var validator$1 = {
    assertOptions: assertOptions,
    validators: validators$1
  };

  var utils$2 = utils$e;
  var buildURL = buildURL$2;
  var InterceptorManager = InterceptorManager_1;
  var dispatchRequest = dispatchRequest$1;
  var mergeConfig$1 = mergeConfig$2;
  var validator = validator$1;

  var validators = validator.validators;
  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   */
  function Axios$1(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {Object} config The config specific for this request (merged with this.defaults)
   */
  Axios$1.prototype.request = function request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    if (!config.url) {
      throw new Error('Provided config url is not valid');
    }

    config = mergeConfig$1(this.defaults, config);

    // Set config.method
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = 'get';
    }

    var transitional = config.transitional;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    // filter out skipped interceptors
    var requestInterceptorChain = [];
    var synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    var responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    var promise;

    if (!synchronousRequestInterceptors) {
      var chain = [dispatchRequest, undefined];

      Array.prototype.unshift.apply(chain, requestInterceptorChain);
      chain = chain.concat(responseInterceptorChain);

      promise = Promise.resolve(config);
      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }

      return promise;
    }


    var newConfig = config;
    while (requestInterceptorChain.length) {
      var onFulfilled = requestInterceptorChain.shift();
      var onRejected = requestInterceptorChain.shift();
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected(error);
        break;
      }
    }

    try {
      promise = dispatchRequest(newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    while (responseInterceptorChain.length) {
      promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
    }

    return promise;
  };

  Axios$1.prototype.getUri = function getUri(config) {
    if (!config.url) {
      throw new Error('Provided config url is not valid');
    }
    config = mergeConfig$1(this.defaults, config);
    return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
  };

  // Provide aliases for supported request methods
  utils$2.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios$1.prototype[method] = function(url, config) {
      return this.request(mergeConfig$1(config || {}, {
        method: method,
        url: url,
        data: (config || {}).data
      }));
    };
  });

  utils$2.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    Axios$1.prototype[method] = function(url, data, config) {
      return this.request(mergeConfig$1(config || {}, {
        method: method,
        url: url,
        data: data
      }));
    };
  });

  var Axios_1 = Axios$1;

  var Cancel = Cancel_1;

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @class
   * @param {Function} executor The executor function.
   */
  function CancelToken(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    var resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    var token = this;

    // eslint-disable-next-line func-names
    this.promise.then(function(cancel) {
      if (!token._listeners) return;

      var i;
      var l = token._listeners.length;

      for (i = 0; i < l; i++) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = function(onfulfilled) {
      var _resolve;
      // eslint-disable-next-line func-names
      var promise = new Promise(function(resolve) {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new Cancel(message);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };

  /**
   * Subscribe to the cancel signal
   */

  CancelToken.prototype.subscribe = function subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  };

  /**
   * Unsubscribe from the cancel signal
   */

  CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    var index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  };

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token: token,
      cancel: cancel
    };
  };

  var CancelToken_1 = CancelToken;

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   * @returns {Function}
   */
  var spread = function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };

  var utils$1 = utils$e;

  /**
   * Determines whether the payload is an error thrown by Axios
   *
   * @param {*} payload The value to test
   * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
   */
  var isAxiosError = function isAxiosError(payload) {
    return utils$1.isObject(payload) && (payload.isAxiosError === true);
  };

  var utils = utils$e;
  var bind = bind$2;
  var Axios = Axios_1;
  var mergeConfig = mergeConfig$2;
  var defaults = defaults_1;

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   * @return {Axios} A new instance of Axios
   */
  function createInstance(defaultConfig) {
    var context = new Axios(defaultConfig);
    var instance = bind(Axios.prototype.request, context);

    // Copy axios.prototype to instance
    utils.extend(instance, Axios.prototype, context);

    // Copy context to instance
    utils.extend(instance, context);

    // Factory for creating new instances
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };

    return instance;
  }

  // Create the default instance to be exported
  var axios$1 = createInstance(defaults);

  // Expose Axios class to allow class inheritance
  axios$1.Axios = Axios;

  // Expose Cancel & CancelToken
  axios$1.Cancel = Cancel_1;
  axios$1.CancelToken = CancelToken_1;
  axios$1.isCancel = isCancel$1;
  axios$1.VERSION = data.version;

  // Expose all/spread
  axios$1.all = function all(promises) {
    return Promise.all(promises);
  };
  axios$1.spread = spread;

  // Expose isAxiosError
  axios$1.isAxiosError = isAxiosError;

  axios$2.exports = axios$1;

  // Allow use of default import syntax in TypeScript
  axios$2.exports.default = axios$1;

  var axios = axios$2.exports;

  var _depth = /*#__PURE__*/new WeakMap();

  var _selector = /*#__PURE__*/new WeakMap();

  var _max = /*#__PURE__*/new WeakMap();

  var _parentCategoryId = /*#__PURE__*/new WeakMap();

  var _columnItemViews = /*#__PURE__*/new WeakMap();

  var _cachedUserValues = /*#__PURE__*/new WeakMap();

  var _ROOT$c = /*#__PURE__*/new WeakMap();

  var _TBODY$1 = /*#__PURE__*/new WeakMap();

  var _draw$1 = /*#__PURE__*/new WeakSet();

  var _update$2 = /*#__PURE__*/new WeakSet();

  var _sort = /*#__PURE__*/new WeakSet();

  var _heatmap = /*#__PURE__*/new WeakSet();

  var _getUserValues = /*#__PURE__*/new WeakSet();

  var _existed = /*#__PURE__*/new WeakMap();

  var ColumnView = /*#__PURE__*/function () {
    function ColumnView(selector, _values, depth, parentCategoryId) {
      var _this = this;

      _classCallCheck(this, ColumnView);

      _classPrivateFieldInitSpec(this, _existed, {
        get: _get_existed,
        set: void 0
      });

      _classPrivateMethodInitSpec(this, _getUserValues);

      _classPrivateMethodInitSpec(this, _heatmap);

      _classPrivateMethodInitSpec(this, _sort);

      _classPrivateMethodInitSpec(this, _update$2);

      _classPrivateMethodInitSpec(this, _draw$1);

      _classPrivateFieldInitSpec(this, _depth, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _selector, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _max, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _parentCategoryId, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _columnItemViews, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _cachedUserValues, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _ROOT$c, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _TBODY$1, {
        writable: true,
        value: void 0
      });

      // set members
      _classPrivateFieldSet(this, _depth, depth);

      _classPrivateFieldSet(this, _selector, selector);

      _classPrivateFieldSet(this, _parentCategoryId, parentCategoryId);

      _classPrivateFieldSet(this, _cachedUserValues, new Map()); // draw


      _classPrivateMethodGet(this, _draw$1, _draw2$1).call(this, _values); // even listener


      DefaultEventEmitter$1.addEventListener(changeViewModes, _classPrivateMethodGet(this, _update$2, _update2$2).bind(this));
      DefaultEventEmitter$1.addEventListener(changeColumnSelectorSorter, _classPrivateMethodGet(this, _update$2, _update2$2).bind(this));

      _classPrivateFieldGet(this, _ROOT$c).addEventListener(collapsed, function (e) {
        if (e.detail) _classPrivateMethodGet(_this, _update$2, _update2$2).call(_this);
      });
    }

    _createClass(ColumnView, [{
      key: "appended",
      value: // public Methods
      function appended() {
        var _this2 = this;

        _classPrivateMethodGet(this, _update$2, _update2$2).call(this); // user IDs


        if (document.body.classList.contains('-showuserids') && ConditionBuilder$1.userIds.length > 0) {
          _classPrivateMethodGet(this, _getUserValues, _getUserValues2).call(this, _classPrivateFieldGet(this, _selector).attributeId, _classPrivateFieldGet(this, _parentCategoryId)).then(function (values) {
            console.log(values);

            _classPrivateFieldGet(_this2, _columnItemViews).forEach(function (columnItemView) {
              return columnItemView.setUserValues(values);
            });
          });
        }
      }
    }, {
      key: "checkValue",
      value: function checkValue(e) {
        e.stopPropagation();
        var checkbox = e.target;
        var ancestors = [];
        var parentCategoryId;
        var column = checkbox.closest('.column');

        do {
          var _column;

          // find ancestors
          parentCategoryId = (_column = column) === null || _column === void 0 ? void 0 : _column.dataset.parentCategoryId;

          if (parentCategoryId) {
            ancestors.unshift(parentCategoryId);
            column = column.previousElementSibling;
          }
        } while (parentCategoryId);

        if (checkbox.checked) {
          // add
          ConditionBuilder$1.addAttributeValue(this.attributeId, checkbox.value, ancestors);
        } else {
          // remove
          ConditionBuilder$1.removeAttributeValue(this.attributeId, checkbox.value);
        }
      } // checkKey(e) {
      // }

    }, {
      key: "drillDown",
      value: function drillDown(e) {
        var itemNode = e.target.closest('tr');
        itemNode.classList.add('-selected');

        _classPrivateFieldGet(this, _selector).drillDown(itemNode.dataset.id, _classPrivateFieldGet(this, _depth));
      } // accessors

    }, {
      key: "depth",
      get: function get() {
        return _classPrivateFieldGet(this, _depth);
      }
    }, {
      key: "attributeId",
      get: function get() {
        return _classPrivateFieldGet(this, _selector).attributeId;
      }
    }, {
      key: "parentCategoryId",
      get: function get() {
        return _classPrivateFieldGet(this, _parentCategoryId);
      }
    }, {
      key: "rootNode",
      get: function get() {
        return _classPrivateFieldGet(this, _ROOT$c);
      }
    }]);

    return ColumnView;
  }();

  function _draw2$1(values) {
    var _classPrivateFieldGet2,
        _this3 = this;

    // make column
    _classPrivateFieldSet(this, _ROOT$c, document.createElement('div'));

    _classPrivateFieldGet(this, _ROOT$c).classList.add('column');

    _classPrivateFieldGet(this, _ROOT$c).dataset.capturingCollapse = true;
    _classPrivateFieldGet(this, _ROOT$c).dataset.parentCategoryId = (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _parentCategoryId)) !== null && _classPrivateFieldGet2 !== void 0 ? _classPrivateFieldGet2 : '';

    _classPrivateFieldSet(this, _max, 0);

    _classPrivateFieldGet(this, _ROOT$c).innerHTML = "\n    <table>\n      <thead>\n        <tr class=\"header\">\n          <th class=\"label\">Values</th>\n          <th class=\"total\">Total</th>\n          <th class=\"mapped\">Mapped</th>\n          <th class=\"pvalue\">p-value</th>\n          <th class=\"drilldown\"></th>\n        </tr>\n      </thead>\n      <tbody></tbody>\n    </table>";

    _classPrivateFieldSet(this, _TBODY$1, _classPrivateFieldGet(this, _ROOT$c).querySelector(':scope > table > tbody'));

    var selectedCategoryIds = ConditionBuilder$1.getSelectedCategoryIds(this.attributeId);

    _classPrivateFieldSet(this, _columnItemViews, values.map(function (value, index) {
      _classPrivateFieldSet(_this3, _max, Math.max(_classPrivateFieldGet(_this3, _max), value.count)); // add item


      var columnItemView = new ColumnItemView(_this3, value, index, selectedCategoryIds);

      _classPrivateFieldGet(_this3, _TBODY$1).append(columnItemView.rootNode);

      return columnItemView;
    })); // attach sort function


    var theadCells = Array.from(_classPrivateFieldGet(this, _ROOT$c).querySelectorAll(':scope > table > thead > tr > th'));
    ColumnSelectorSortManager$1.sortableColumns.forEach(function (sortableColumn) {
      var cell = theadCells.find(function (cell) {
        return cell.classList.contains(sortableColumn);
      });
      cell.classList.add('-sortable');
      cell.insertAdjacentHTML('beforeend', "<div class=\"sorter\" data-column=\"".concat(sortableColumn, "\"></div>"));
    });

    _classPrivateFieldGet(this, _ROOT$c).querySelectorAll(':scope > table > thead > tr > .-sortable').forEach(function (sortable) {
      sortable.addEventListener('click', function (_ref) {
        var target = _ref.target;
        var sorter = target.querySelector(':scope > .sorter');
        ColumnSelectorSortManager$1.setSort(sorter.dataset.column);
      });
    });
  }

  function _update2$2() {
    if (_classPrivateFieldGet(this, _selector).isShowing && _classPrivateFieldGet(this, _existed)) {
      _classPrivateMethodGet(this, _sort, _sort2).call(this);

      _classPrivateMethodGet(this, _heatmap, _heatmap2).call(this);
    }
  }

  function _sort2() {
    var _this4 = this;

    var sortDescriptor = ColumnSelectorSortManager$1.sortDescriptor; // sorted by 'label' or 'total (= count)'

    var column = {
      '': 'index',
      label: 'label',
      total: 'count'
    }[sortDescriptor.column];

    var items = _classPrivateFieldGet(this, _columnItemViews).map(function (columnItemView) {
      return {
        index: columnItemView.index,
        value: columnItemView[column]
      };
    });

    switch (sortDescriptor.column) {
      case 'label':
        items.sort(function (a, b) {
          return a.value > b.value ? 1 : -1;
        });
        break;

      case 'total':
        items.sort(function (a, b) {
          return b.value - a.value;
        });
        break;
    }

    if (sortDescriptor.direction === 'desc') items.reverse(); // replace

    items.forEach(function (item) {
      _classPrivateFieldGet(_this4, _TBODY$1).append(_classPrivateFieldGet(_this4, _columnItemViews)[item.index].rootNode);
    });
  }

  function _heatmap2() {
    var isLog10 = App$1.viewModes.log10;
    var max = isLog10 && _classPrivateFieldGet(this, _max) > 1 ? Math.log10(_classPrivateFieldGet(this, _max)) : _classPrivateFieldGet(this, _max);
    var category = Records$1.getCatexxxgoryWithAttributeId(this.attributeId);

    _classPrivateFieldGet(this, _columnItemViews).forEach(function (columnItemView) {
      columnItemView.update(category.color, isLog10, max);
    });
  }

  function _getUserValues2(attribute, node) {
    var _this5 = this;

    return new Promise(function (resolve, reject) {
      var parameter = getApiParameter('locate', {
        attribute: attribute,
        node: node,
        dataset: ConditionBuilder$1.currentTogoKey,
        queries: ConditionBuilder$1.userIds
      });

      var values = _classPrivateFieldGet(_this5, _cachedUserValues).get(parameter);

      if (values) {
        resolve(values);
      } else {
        axios.post(App$1.getApiUrl('locate'), parameter) // .get(parameter)
        .then(function (response) {
          var __temp__data = response.data.map(function (datum) {
            return {
              categoryId: datum.node,
              count: datum.count,
              hit_count: datum.mapped,
              label: datum.label,
              pValue: datum.pvalue
            };
          });

          _classPrivateFieldGet(_this5, _cachedUserValues).set(parameter, __temp__data);

          resolve(__temp__data);
        });
      }
    });
  }

  function _get_existed() {
    return _classPrivateFieldGet(this, _ROOT$c).parentNode !== null;
  }

  var _attribute$3 = /*#__PURE__*/new WeakMap();

  var _items$1 = /*#__PURE__*/new WeakMap();

  var _columnViews = /*#__PURE__*/new WeakMap();

  var _currentColumnViews = /*#__PURE__*/new WeakMap();

  var _ROOT$b = /*#__PURE__*/new WeakMap();

  var _CONTAINER$1 = /*#__PURE__*/new WeakMap();

  var _LOADING_VIEW$2 = /*#__PURE__*/new WeakMap();

  var _CONTAINED_VIEW = /*#__PURE__*/new WeakMap();

  var _setItems = /*#__PURE__*/new WeakSet();

  var _getColumn = /*#__PURE__*/new WeakSet();

  var _makeCoumnView = /*#__PURE__*/new WeakSet();

  var _setSubColumn = /*#__PURE__*/new WeakSet();

  var _appendSubColumn = /*#__PURE__*/new WeakSet();

  var _setSelectedValue = /*#__PURE__*/new WeakSet();

  var ColumnSelectorView = /*#__PURE__*/function () {
    function ColumnSelectorView(elm, attribute, _items2) {
      _classCallCheck(this, ColumnSelectorView);

      _classPrivateMethodInitSpec(this, _setSelectedValue);

      _classPrivateMethodInitSpec(this, _appendSubColumn);

      _classPrivateMethodInitSpec(this, _setSubColumn);

      _classPrivateMethodInitSpec(this, _makeCoumnView);

      _classPrivateMethodInitSpec(this, _getColumn);

      _classPrivateMethodInitSpec(this, _setItems);

      _classPrivateFieldInitSpec(this, _attribute$3, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _items$1, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _columnViews, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _currentColumnViews, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _ROOT$b, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _CONTAINER$1, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _LOADING_VIEW$2, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _CONTAINED_VIEW, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(this, _attribute$3, attribute);

      _classPrivateFieldSet(this, _items$1, {});

      _classPrivateFieldSet(this, _columnViews, []);

      _classPrivateFieldSet(this, _currentColumnViews, []); // make container


      elm.innerHTML = "\n    <div class=\"column-selector-view\">\n      <div class=\"columns\">\n        <div class=\"inner\"></div>\n      </div>\n      <div class=\"loading-view\"></div>\n    </div>";

      _classPrivateFieldSet(this, _ROOT$b, elm.querySelector(':scope > .column-selector-view'));

      _classPrivateFieldSet(this, _CONTAINER$1, _classPrivateFieldGet(this, _ROOT$b).querySelector(':scope > .columns > .inner'));

      _classPrivateFieldSet(this, _LOADING_VIEW$2, _classPrivateFieldGet(this, _ROOT$b).querySelector(':scope > .loading-view'));

      _classPrivateFieldSet(this, _CONTAINED_VIEW, _classPrivateFieldGet(this, _ROOT$b).closest('.attribute-track-view'));

      var _depth = 0;

      _classPrivateMethodGet(this, _setItems, _setItems2).call(this, _items2, _depth); // make root column


      var _columnView = _classPrivateMethodGet(this, _makeCoumnView, _makeCoumnView2).call(this, _items2, _depth);

      _classPrivateMethodGet(this, _appendSubColumn, _appendSubColumn2).call(this, _columnView, _depth);
    } // private methods


    _createClass(ColumnSelectorView, [{
      key: "drillDown",
      value: // public methods
      function drillDown(categoryId, depth) {
        var _this = this;

        // delete an existing lower columns
        if (_classPrivateFieldGet(this, _currentColumnViews).length > depth + 1) {
          for (var depth2 = depth + 1; depth2 < _classPrivateFieldGet(this, _currentColumnViews).length; depth2++) {
            var column = _classPrivateFieldGet(this, _currentColumnViews)[depth2];

            if (column.rootNode.parentNode) column.rootNode.remove();
          }
        } // deselect siblings


        var selectedItemKeys = Object.keys(_classPrivateFieldGet(this, _items$1)).filter(function (id) {
          return _classPrivateFieldGet(_this, _items$1)[id].selected && _classPrivateFieldGet(_this, _items$1)[id].depth >= depth;
        });

        var _iterator = _createForOfIteratorHelper(selectedItemKeys),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _classPrivateFieldGet2;

            var key = _step.value;
            _classPrivateFieldGet(this, _items$1)[key].selected = false;
            (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _currentColumnViews)[depth].rootNode.querySelector("[data-id=\"".concat(key, "\"]"))) === null || _classPrivateFieldGet2 === void 0 ? void 0 : _classPrivateFieldGet2.classList.remove('-selected');
          } // get lower column

        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        _classPrivateMethodGet(this, _setSelectedValue, _setSelectedValue2).call(this, categoryId, true);

        _classPrivateMethodGet(this, _setSubColumn, _setSubColumn2).call(this, categoryId, depth + 1);
      } // accessors

    }, {
      key: "attributeId",
      get: function get() {
        return _classPrivateFieldGet(this, _attribute$3).id;
      }
    }, {
      key: "api",
      get: function get() {
        return _classPrivateFieldGet(this, _attribute$3).api;
      }
    }, {
      key: "dataset",
      get: function get() {
        return _classPrivateFieldGet(this, _attribute$3).dataset;
      }
    }, {
      key: "isShowing",
      get: function get() {
        return _classPrivateFieldGet(this, _CONTAINED_VIEW).classList.contains('-spread');
      }
    }]);

    return ColumnSelectorView;
  }();

  function _setItems2(items, depth) {
    var _iterator2 = _createForOfIteratorHelper(items),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var item = _step2.value;
        _classPrivateFieldGet(this, _items$1)[item.categoryId] = {
          depth: depth,
          selected: false
        };
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  function _getColumn2(categoryId, depth) {
    var _this2 = this;

    return new Promise(function (resolve, reject) {
      var columnView = _classPrivateFieldGet(_this2, _columnViews).find(function (columnView) {
        return columnView.parentCategoryId === categoryId;
      });

      if (columnView) {
        resolve(columnView);
      } else {
        Records$1.fetchAttributeValues(_classPrivateFieldGet(_this2, _attribute$3).id, categoryId).then(function (values) {
          _classPrivateMethodGet(_this2, _setItems, _setItems2).call(_this2, values, depth);

          var columnView = _classPrivateMethodGet(_this2, _makeCoumnView, _makeCoumnView2).call(_this2, values, depth, categoryId);

          resolve(columnView);
        }).catch(function (error) {
          reject(error);
        });
      }
    });
  }

  function _makeCoumnView2(values, depth, parentCategoryId) {
    var columnView = new ColumnView(this, values, depth, parentCategoryId);

    _classPrivateFieldGet(this, _columnViews).push(columnView);

    return columnView;
  }

  function _setSubColumn2(categoryId, depth) {
    var _this3 = this;

    _classPrivateFieldGet(this, _LOADING_VIEW$2).classList.add('-shown');

    _classPrivateMethodGet(this, _getColumn, _getColumn2).call(this, categoryId, depth).then(function (column) {
      _classPrivateMethodGet(_this3, _appendSubColumn, _appendSubColumn2).call(_this3, column, depth);

      _classPrivateFieldGet(_this3, _LOADING_VIEW$2).classList.remove('-shown');
    }).catch(function (error) {
      // TODO: エラー処理
      _classPrivateFieldGet(_this3, _LOADING_VIEW$2).classList.remove('-shown');

      throw Error(error);
    });
  }

  function _appendSubColumn2(columnView, depth) {
    _classPrivateFieldGet(this, _currentColumnViews)[depth] = columnView;

    _classPrivateFieldGet(this, _CONTAINER$1).append(columnView.rootNode);

    columnView.appended(); // scroll

    var left = _classPrivateFieldGet(this, _CONTAINER$1).scrollWidth - _classPrivateFieldGet(this, _CONTAINER$1).clientWidth;

    if (left > 0) {
      _classPrivateFieldGet(this, _CONTAINER$1).scrollTo({
        top: 0,
        left: left,
        behavior: 'smooth'
      });
    }
  }

  function _setSelectedValue2(categoryId, selected) {
    _classPrivateFieldGet(this, _items$1)[categoryId].selected = selected;
  }

  var _target = /*#__PURE__*/new WeakMap();

  var _selection = /*#__PURE__*/new WeakMap();

  var _unit = /*#__PURE__*/new WeakMap();

  var _SELECTING_AREA = /*#__PURE__*/new WeakMap();

  var _SELECTOR_BARS = /*#__PURE__*/new WeakMap();

  var _defineSelection = /*#__PURE__*/new WeakSet();

  var _defineInteraction = /*#__PURE__*/new WeakSet();

  var _update$1 = /*#__PURE__*/new WeakSet();

  var HistogramRangeSelectorController = /*#__PURE__*/function () {
    function HistogramRangeSelectorController(target, _selector) {
      _classCallCheck(this, HistogramRangeSelectorController);

      _classPrivateMethodInitSpec(this, _update$1);

      _classPrivateMethodInitSpec(this, _defineInteraction);

      _classPrivateMethodInitSpec(this, _defineSelection);

      _classPrivateFieldInitSpec(this, _target, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _selection, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _unit, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _SELECTING_AREA, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _SELECTOR_BARS, {
        writable: true,
        value: void 0
      });

      // definition
      _classPrivateFieldSet(this, _target, target);

      _classPrivateFieldSet(this, _unit, 100 / target.items.length);

      _classPrivateFieldSet(this, _selection, {});

      _classPrivateMethodGet(this, _defineSelection, _defineSelection2).call(this); // reference


      _classPrivateFieldSet(this, _SELECTING_AREA, _selector.querySelector(':scope > .inner > .selectingarea'));

      _classPrivateFieldSet(this, _SELECTOR_BARS, _selector.querySelectorAll(':scope > .inner > .overview > .bar')); // interaction


      _classPrivateMethodGet(this, _defineInteraction, _defineInteraction2).call(this, _selector);
    } // private methods


    _createClass(HistogramRangeSelectorController, [{
      key: "start",
      get: // accessor
      function get() {
        return _classPrivateFieldGet(this, _selection).start;
      }
    }, {
      key: "end",
      get: function get() {
        return _classPrivateFieldGet(this, _selection).end;
      }
    }, {
      key: "width",
      get: function get() {
        return this.end - this.start;
      }
    }, {
      key: "selectedItems",
      get: function get() {
        var _this = this;

        var items = [];

        if (this.width !== 0) {
          items.push.apply(items, _toConsumableArray(_classPrivateFieldGet(this, _target).items.filter(function (item_, index) {
            if (_this.start <= index && index < _this.end) return true;else return false;
          })));
        }

        return items;
      }
    }]);

    return HistogramRangeSelectorController;
  }();

  function _defineSelection2() {
    var selectionStart = 0,
        selectionEnd = 0;
    var self = this;
    Object.defineProperties(_classPrivateFieldGet(this, _selection), {
      start: {
        get: function get() {
          return selectionStart;
        },
        set: function set(value) {
          if (selectionStart !== value) {
            selectionStart = value;

            _classPrivateMethodGet(self, _update$1, _update2$1).call(self);
          }
        }
      },
      end: {
        get: function get() {
          return selectionEnd;
        },
        set: function set(value) {
          if (selectionEnd !== value) {
            selectionEnd = value;

            _classPrivateMethodGet(self, _update$1, _update2$1).call(self);
          }
        }
      },
      range: {
        get: function get() {
          return [selectionStart, selectionEnd];
        },
        set: function set(_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              start = _ref2[0],
              end = _ref2[1];

          if (selectionStart !== start || selectionEnd !== end) {
            selectionStart = start;
            selectionEnd = end;

            _classPrivateMethodGet(self, _update$1, _update2$1).call(self);
          }
        }
      }
    });
  }

  function _defineInteraction2(selector) {
    var _this2 = this;

    var isMouseDown = false,
        startX,
        initialStart,
        initialEnd,
        initialWidth,
        totalWidth,
        interactionType,
        direction; // references

    var selectorController = selector.querySelector(':scope > .inner > .controller');
    var handlesArray = Array.from(_classPrivateFieldGet(this, _SELECTING_AREA).querySelectorAll(':scope > .handle'));
    ({
      left: handlesArray.filter(function (handle) {
        return handle.dataset.direction === 'start';
      }),
      right: handlesArray.filter(function (handle) {
        return handle.dataset.direction === 'end';
      })
    });

    var init = function init(e) {
      e.stopImmediatePropagation();
      totalWidth = selectorController.getBoundingClientRect().width;
      isMouseDown = true;
      var x = e.x - selectorController.getBoundingClientRect().x;
      startX = x / totalWidth * 100;
    }; // make selecting area


    selectorController.addEventListener('mousedown', function (e) {
      interactionType = 'make';
      selector.classList.add('-makingarea');
      init(e);
    }); // drag selecting area

    _classPrivateFieldGet(this, _SELECTING_AREA).addEventListener('mousedown', function (e) {
      interactionType = 'drag';
      selector.classList.add('-draggingarea');
      initialStart = _this2.start;
      initialWidth = _this2.width;
      init(e);
    }); // resize selecting area


    handlesArray.forEach(function (handle) {
      return handle.addEventListener('mousedown', function (e) {
        interactionType = 'resize';
        direction = e.target.dataset.direction;
        selector.classList.add('-resizingarea');
        initialStart = _this2.start;
        initialEnd = _this2.end;
        init(e);
      });
    }); // dragging behavior

    selectorController.addEventListener('mousemove', function (e) {
      if (isMouseDown) {
        var range;
        var x = e.layerX / totalWidth * 100;

        switch (interactionType) {
          case 'make':
            {
              // calculate selection range
              var selectedWidth = x - startX;
              var start, end;

              if (selectedWidth > 0) {
                start = startX;
                end = x;
              } else {
                start = x;
                end = startX;
              }

              range = [Math.floor(start / _classPrivateFieldGet(_this2, _unit)), Math.ceil(end / _classPrivateFieldGet(_this2, _unit))];
            }
            break;

          case 'drag':
            {
              var translation = (x - startX) / _classPrivateFieldGet(_this2, _unit);

              if (translation < -.5) translation = Math.floor(translation + .5);else if (.5 < translation) translation = Math.ceil(translation - .5);else translation = 0;
              translation -= initialStart + translation < 0 ? initialStart + translation : 0;
              translation -= initialStart + translation + initialWidth > _classPrivateFieldGet(_this2, _target).items.length ? initialStart + translation + initialWidth - _classPrivateFieldGet(_this2, _target).items.length : 0;
              range = [initialStart + translation, initialStart + translation + initialWidth];
            }
            break;

          case 'resize':
            {
              var _start = initialStart,
                  _end = initialEnd;

              switch (direction) {
                case 'start':
                  _start += Math.floor((x - startX) / _classPrivateFieldGet(_this2, _unit) + .5);

                  if (_end < _start) {
                    var _ref3 = [_end, _start];
                    _start = _ref3[0];
                    _end = _ref3[1];
                  }

                  break;

                case 'end':
                  _end += Math.ceil((x - startX) / _classPrivateFieldGet(_this2, _unit) - .5);

                  if (_end < _start) {
                    var _ref4 = [_end, _start];
                    _start = _ref4[0];
                    _end = _ref4[1];
                  }

                  break;
              }

              if (_start < 0) _start = 0;
              if (_classPrivateFieldGet(_this2, _target).items.length < _end) _end = _classPrivateFieldGet(_this2, _target).items.length;
              range = [_start, _end];
            }
            break;
        }

        _classPrivateFieldGet(_this2, _selection).range = range;
      }
    });
    selectorController.addEventListener('mouseup', function () {
      if (isMouseDown) {
        selector.classList.remove('-makingarea');
        selector.classList.remove('-draggingarea');
        selector.classList.remove('-resizingarea');
        isMouseDown = false;

        _classPrivateMethodGet(_this2, _update$1, _update2$1).call(_this2);
      }
    });
  }

  function _update2$1() {
    var _this3 = this;

    // selecting area
    _classPrivateFieldGet(this, _SELECTING_AREA).style.left = this.start * _classPrivateFieldGet(this, _unit) + '%';
    _classPrivateFieldGet(this, _SELECTING_AREA).style.width = (this.end - this.start) * _classPrivateFieldGet(this, _unit) + '%'; // overview

    _classPrivateFieldGet(this, _SELECTOR_BARS).forEach(function (bar, index) {
      if (_this3.start <= index && index < _this3.end) bar.classList.add('-selected');else bar.classList.remove('-selected');
    });

    _classPrivateFieldGet(this, _target).update(); // set condition


    ConditionBuilder$1.setAttributeValues(_classPrivateFieldGet(this, _target).attributeId, this.selectedItems.map(function (item) {
      return item.categoryId;
    }), false);
  }

  /**
   *
   * @param {Color} baseColor
   * @param {Color} tintColor
   */

  function colorTintByHue(baseColor, hue) {
    return baseColor.mix(new h('hsv', [hue, 70, 50]), 0.15).set({
      lightness: function lightness(_lightness) {
        return _lightness * 1.1;
      }
    }).to('srgb');
  }
  function createPopupEvent(uniqueEntry, newEvent) {
    var _uniqueEntry$getAttri = uniqueEntry.getAttribute('data-order').split(','),
        _uniqueEntry$getAttri2 = _slicedToArray(_uniqueEntry$getAttri, 2),
        x = _uniqueEntry$getAttri2[0],
        y = _uniqueEntry$getAttri2[1];

    var customEvent = new CustomEvent(newEvent, {
      detail: {
        keys: {
          dataKey: uniqueEntry.getAttribute('data-key'),
          subjectId: uniqueEntry.getAttribute('data-subject-id'),
          mainCategoryId: uniqueEntry.getAttribute('data-main-category-id'),
          subCategoryId: uniqueEntry.getAttribute('data-sub-category-id'),
          uniqueEntryId: uniqueEntry.getAttribute('data-unique-entry-id')
        },
        properties: {
          dataX: x,
          dataY: y,
          dataSubOrder: uniqueEntry.getAttribute('data-sub-order'),
          isPrimaryKey: uniqueEntry.classList.contains('primarykey')
        }
      }
    });
    DefaultEventEmitter$1.dispatchEvent(customEvent);
  }

  var NUM_OF_GRID = 4;

  var _items = /*#__PURE__*/new WeakMap();

  var _attribute$2 = /*#__PURE__*/new WeakMap();

  var _selectorController = /*#__PURE__*/new WeakMap();

  var _OVERVIEW_CONTAINER$1 = /*#__PURE__*/new WeakMap();

  var _ROOT$a = /*#__PURE__*/new WeakMap();

  var _GRIDS = /*#__PURE__*/new WeakMap();

  var _indicateValue = /*#__PURE__*/new WeakSet();

  var HistogramRangeSelectorView = /*#__PURE__*/function () {
    function HistogramRangeSelectorView(elm, attribute, items) {
      var _this = this;

      _classCallCheck(this, HistogramRangeSelectorView);

      _classPrivateMethodInitSpec(this, _indicateValue);

      _classPrivateFieldInitSpec(this, _items, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _attribute$2, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _selectorController, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _OVERVIEW_CONTAINER$1, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _ROOT$a, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _GRIDS, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(this, _attribute$2, attribute);

      var category = Records$1.getCatexxxgoryWithAttributeId(_classPrivateFieldGet(this, _attribute$2).id);

      _classPrivateFieldSet(this, _items, items.map(function (item) {
        return Object.assign({}, item);
      })); // make container


      elm.innerHTML = "\n    <div class=\"histogram-range-selector-view\">\n      <div class=\"selector\">\n        <div class=\"inner\">\n          <div class=\"overview\"></div>\n          <div class=\"controller\"></div>\n          <div class=\"selectingarea\">\n            <div class=\"handle\" data-direction=\"start\"></div>\n            <div class=\"handle\" data-direction=\"end\"></div>\n          </div>\n        </div>\n      </div>\n      <div class=\"histogram\">\n        <div class=\"graph\"></div>\n        <div class=\"gridcontainer\">\n          ".concat('<div class="grid"><p class="label"></p></div>'.repeat(NUM_OF_GRID), "\n        </div>\n        <svg class=\"additionalline\"></svg>\n      </div>");

      _classPrivateFieldSet(this, _ROOT$a, elm.querySelector(':scope > .histogram-range-selector-view'));

      var histogram = _classPrivateFieldGet(this, _ROOT$a).querySelector(':scope > .histogram');

      var selector = _classPrivateFieldGet(this, _ROOT$a).querySelector(':scope > .selector > .inner');

      var overview = selector.querySelector(':scope > .overview'); // make graph

      var max = Math.max.apply(Math, _toConsumableArray(_classPrivateFieldGet(this, _items).map(function (item) {
        return item.count;
      })));

      var width = 100 / _classPrivateFieldGet(this, _items).length;

      overview.innerHTML = _classPrivateFieldGet(this, _items).map(function (item) {
        return "<div\n      class=\"bar _catexxxgory-background-color\"\n      data-category-id=\"".concat(item.categoryId, "\"\n      data-count=\"").concat(item.count, "\"\n      style=\"width: ").concat(width, "%; height: ").concat(item.count / max * 100, "%;\"></div>");
      }).join('');
      var graph = histogram.querySelector(':scope > .graph');
      graph.innerHTML = _classPrivateFieldGet(this, _items).map(function (item, index) {
        return "<div class=\"bar\" data-category-id=\"".concat(item.categoryId, "\" data-count=\"").concat(item.count, "\">\n      <div class=\"actual\" style=\"background-color: rgb(").concat(colorTintByHue(category.color, 360 * index / _classPrivateFieldGet(_this, _items).length).coords.map(function (cood) {
          return cood * 256;
        }).join(','), ");\"></div>\n      <p class=\"label\">").concat(item.label, "</p>\n    </div>");
      }).join(''); // reference

      histogram.querySelectorAll(':scope > .graph > .bar').forEach(function (item, index) {
        return _classPrivateFieldGet(_this, _items)[index].elm = item;
      });

      _classPrivateFieldSet(this, _GRIDS, histogram.querySelectorAll(':scope > .gridcontainer > .grid')); // event


      DefaultEventEmitter$1.addEventListener(changeViewModes, function (e) {
        return _this.update();
      }); // this.#setupRangeSelector();

      _classPrivateFieldSet(this, _selectorController, new HistogramRangeSelectorController(this, _classPrivateFieldGet(this, _ROOT$a).querySelector(':scope > .selector')));

      this.update();
    } // private methods


    _createClass(HistogramRangeSelectorView, [{
      key: "update",
      value: // public methods
      function update() {
        var selectedItems = _classPrivateFieldGet(this, _selectorController).width === 0 ? _classPrivateFieldGet(this, _items) : _classPrivateFieldGet(this, _selectorController).selectedItems;
        var max = Math.max.apply(Math, _toConsumableArray(selectedItems.map(function (item) {
          return item.count;
        })));
        var isLog10 = App$1.viewModes.log10;
        var processedMax = isLog10 ? Math.log10(max) : max;
        var width = 100 / selectedItems.length; // grid

        var digits = String(Math.ceil(max)).length;
        var unit = Number(String(max).charAt(0).padEnd(digits, '0')) / NUM_OF_GRID;

        _classPrivateFieldGet(this, _GRIDS).forEach(function (grid, index) {
          var scale = unit * index;
          grid.style.bottom = "".concat((isLog10 ? Math.log10(scale) : scale) / processedMax * 100, "%");
          grid.querySelector(':scope > .label').textContent = scale.toLocaleString();
        }); // graph


        _classPrivateFieldGet(this, _items).forEach(function (item) {
          if (selectedItems.indexOf(item) === -1) {
            item.elm.classList.add('-filtered');
          } else {
            item.elm.classList.remove('-filtered');
            var height = (isLog10 ? Math.log10(item.count) : item.count) / processedMax * 100;
            item.elm.style.width = "".concat(width, "%");
            item.elm.querySelector(':scope > .actual').style.height = "".concat(height, "%");
          }
        });
      } // public accessor

    }, {
      key: "items",
      get: function get() {
        return _classPrivateFieldGet(this, _items);
      }
    }, {
      key: "attributeId",
      get: function get() {
        return _classPrivateFieldGet(this, _attribute$2).id;
      }
    }]);

    return HistogramRangeSelectorView;
  }();

  var MIN_PIN_SIZE = 12;
  var MAX_PIN_SIZE = 24;
  var RANGE_PIN_SIZE = MAX_PIN_SIZE - MIN_PIN_SIZE;

  var _attribute$1 = /*#__PURE__*/new WeakMap();

  var _values = /*#__PURE__*/new WeakMap();

  var _userValues = /*#__PURE__*/new WeakMap();

  var _ROOT$9 = /*#__PURE__*/new WeakMap();

  var _update = /*#__PURE__*/new WeakSet();

  var _plotUserIdValues = /*#__PURE__*/new WeakSet();

  var _clearUserIdValues = /*#__PURE__*/new WeakSet();

  var TrackOverviewCategorical = /*#__PURE__*/_createClass(function TrackOverviewCategorical(elm, attribute, values) {
    var _this = this;

    _classCallCheck(this, TrackOverviewCategorical);

    _classPrivateMethodInitSpec(this, _clearUserIdValues);

    _classPrivateMethodInitSpec(this, _plotUserIdValues);

    _classPrivateMethodInitSpec(this, _update);

    _classPrivateFieldInitSpec(this, _attribute$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _values, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _userValues, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _ROOT$9, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _ROOT$9, elm);

    _classPrivateFieldSet(this, _attribute$1, attribute);

    _classPrivateFieldSet(this, _values, values.map(function (value) {
      return Object.assign({}, value);
    }));

    var category = Records$1.getCatexxxgoryWithAttributeId(_classPrivateFieldGet(this, _attribute$1).id); // make overview
    // TODO: ヒストグラムは別処理

    var _sum = values.reduce(function (acc, value) {
      return acc + value.count;
    }, 0);

    var _width = 100 / values.length;

    var selectedValues = ConditionBuilder$1.getSelectedCategoryIds(attribute.id).values;
    elm.innerHTML = _classPrivateFieldGet(this, _values).map(function (value, index) {
      value.countLog10 = value.count === 0 ? 0 : Math.log10(value.count);
      value.width = value.count / _sum * 100;
      value.baseColor = colorTintByHue(category.color, 360 * index / values.length);
      var selectedClass = selectedValues.indexOf(value.categoryId) !== -1 ? ' -selected' : '';
      return "\n        <li class=\"track-value-view _catexxxgory-background-color".concat(selectedClass, "\" style=\"width: ").concat(_width, "%;\" data-category-id=\"").concat(value.categoryId, "\">\n          <div class=\"labels\">\n            <p>\n              <span class=\"label\">").concat(value.label, "</span>\n              <span class=\"count\">").concat(value.count.toLocaleString(), "</span>\n            </p>\n          </div>\n          <div class=\"pin\">\n            <span class=\"material-icons\">location_on</span>\n          </div>\n        </li>");
    }).join('');
    elm.querySelectorAll(':scope > .track-value-view').forEach(function (elm, index) {
      // reference
      var value = _classPrivateFieldGet(_this, _values)[index];

      value.elm = elm;
      value.pin = elm.querySelector(':scope > .pin');
      value.icon = value.pin.querySelector(':scope > .material-icons'); // attach event: show tooltip

      var label = "<span class=\"_catexxxgory-color\" data-catexxxgory-id=\"".concat(category.id, "\">").concat(value.label, "</span>");
      elm.addEventListener('mouseenter', function () {
        var _classPrivateFieldGet2;

        var values = [];
        var userValue = (_classPrivateFieldGet2 = _classPrivateFieldGet(_this, _userValues)) === null || _classPrivateFieldGet2 === void 0 ? void 0 : _classPrivateFieldGet2.find(function (userValue) {
          return userValue.categoryId === value.categoryId;
        });

        if (userValue !== null && userValue !== void 0 && userValue.hit_count) {
          // does not have user value
          values.push({
            key: 'Count',
            value: "".concat(value.userValueCount.toLocaleString(), " / ").concat(value.count.toLocaleString())
          });

          if (userValue !== null && userValue !== void 0 && userValue.pValue) {
            values.push({
              key: 'P-value',
              value: userValue.pValue === 1 ? 1 : userValue.pValue.toExponential(3)
            });
          }
        } else {
          // has user value
          values.push({
            key: 'Count',
            value: value.count.toLocaleString()
          });
        }

        var customEvent = new CustomEvent(enterAttributeValueItemView, {
          detail: {
            label: label,
            values: values,
            elm: elm
          }
        });
        DefaultEventEmitter$1.dispatchEvent(customEvent);
      });
      elm.addEventListener('mouseleave', function () {
        var customEvent = new CustomEvent(leaveAttributeValueItemView);
        DefaultEventEmitter$1.dispatchEvent(customEvent);
      }); // attach event: select/deselect a value

      elm.addEventListener('click', function () {
        if (elm.classList.contains('-selected')) {
          elm.classList.remove('-selected');
          ConditionBuilder$1.removeAttributeValue(_classPrivateFieldGet(_this, _attribute$1).id, value.categoryId);
        } else {
          elm.classList.add('-selected');
          ConditionBuilder$1.addAttributeValue(_classPrivateFieldGet(_this, _attribute$1).id, value.categoryId);
        }
      });
    }); // event listener

    DefaultEventEmitter$1.addEventListener(mutateAttributeValueCondition, function (_ref) {
      var _ref$detail = _ref.detail,
          action = _ref$detail.action,
          attributeId = _ref$detail.attributeId,
          categoryId = _ref$detail.categoryId;

      if (_classPrivateFieldGet(_this, _attribute$1).id === attributeId) {
        _classPrivateFieldGet(_this, _values).forEach(function (value) {
          if (value.categoryId === categoryId) {
            switch (action) {
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
    DefaultEventEmitter$1.addEventListener(changeViewModes, function (e) {
      return _classPrivateMethodGet(_this, _update, _update2).call(_this, e.detail);
    });
    DefaultEventEmitter$1.addEventListener(setUserValues, function (e) {
      return _classPrivateMethodGet(_this, _plotUserIdValues, _plotUserIdValues2).call(_this, e.detail);
    });
    DefaultEventEmitter$1.addEventListener(clearUserValues, function (e) {
      return _classPrivateMethodGet(_this, _clearUserIdValues, _clearUserIdValues2).call(_this, e.detail);
    });

    _classPrivateMethodGet(this, _update, _update2).call(this, App$1.viewModes);
  });

  function _update2(viewModes) {
    var isLog10 = viewModes.log10;

    var sum = _classPrivateFieldGet(this, _values).reduce(function (acc, value) {
      return acc + (isLog10 ? value.countLog10 : value.count);
    }, 0);

    var max = Math.max.apply(Math, _toConsumableArray(_classPrivateFieldGet(this, _values).map(function (value) {
      return value.count;
    })));
    max = isLog10 ? Math.log10(max) : max;
    var left = 0;

    _classPrivateFieldGet(this, _values).forEach(function (value) {
      var width = (isLog10 ? value.count === 0 ? 0 : Math.log10(value.count) : value.count) / sum * 100;
      value.elm.style.backgroundColor = "rgb(".concat(value.baseColor.mix(App$1.colorSilver, 1 - (isLog10 ? value.countLog10 : value.count) / max).coords.map(function (cood) {
        return cood * 256;
      }).join(','), ")");
      value.elm.style.width = width + '%';
      value.elm.style.left = left + '%';
      left += width;
    });
  }

  function _plotUserIdValues2(detail) {
    if (_classPrivateFieldGet(this, _attribute$1).id === detail.attributeId) {
      _classPrivateFieldGet(this, _ROOT$9).classList.add('-pinsticking');

      _classPrivateFieldSet(this, _userValues, detail.values); // mapping


      _classPrivateFieldGet(this, _values).forEach(function (value) {
        var userValue = detail.values.find(function (userValue) {
          return userValue.categoryId === value.categoryId;
        });

        if (userValue !== null && userValue !== void 0 && userValue.hit_count) {
          value.elm.classList.add('-pinsticking'); // pin

          var ratio,
              pValueGreaterThan = 1;
          ratio = userValue.hit_count / value.count;
          ratio = ratio > 1 ? 1 : ratio;

          if (userValue.pValue) {
            switch (true) {
              case userValue.pValue < 0.001:
                pValueGreaterThan = '<0.001';
                break;

              case userValue.pValue < 0.005:
                pValueGreaterThan = '<0.005';
                break;

              case userValue.pValue < 0.01:
                pValueGreaterThan = '<0.01';
                break;

              case userValue.pValue < 0.05:
                pValueGreaterThan = '<0.05';
                break;

              case userValue.pValue < 0.1:
                pValueGreaterThan = '<0.1';
                break;

              case userValue.pValue < 1:
                pValueGreaterThan = '<1';
                break;
            }
          } else {
            pValueGreaterThan = 1;
          }

          var size = MIN_PIN_SIZE + RANGE_PIN_SIZE * ratio;
          value.pin.style.width = size + 'px';
          value.pin.style.height = size + 'px';
          value.icon.style.fontSize = size + 'px';
          value.userValueCount = userValue.hit_count;
          value.elm.dataset.pValueGreaterThan = pValueGreaterThan;
        } else {
          value.elm.classList.remove('-pinsticking');
        }
      });
    }
  }

  function _clearUserIdValues2() {
    _classPrivateFieldGet(this, _values).forEach(function (value) {
      return value.elm.classList.remove('-pinsticking');
    });

    _classPrivateFieldSet(this, _userValues, undefined);
  }

  var _attribute = /*#__PURE__*/new WeakMap();

  var _ROOT$8 = /*#__PURE__*/new WeakMap();

  var _LOADING_VIEW$1 = /*#__PURE__*/new WeakMap();

  var _SELECT_CONTAINER = /*#__PURE__*/new WeakMap();

  var _OVERVIEW_CONTAINER = /*#__PURE__*/new WeakMap();

  var _CHECKBOX_ALL_PROPERTIES = /*#__PURE__*/new WeakMap();

  var _COLLAPSE_BUTTON = /*#__PURE__*/new WeakMap();

  var _makeValues = /*#__PURE__*/new WeakSet();

  var _showError = /*#__PURE__*/new WeakSet();

  var _clearError = /*#__PURE__*/new WeakSet();

  var AttributeTrackView = /*#__PURE__*/_createClass(function AttributeTrackView(attributeId, container, positionRate) {
    var _this = this;

    _classCallCheck(this, AttributeTrackView);

    _classPrivateMethodInitSpec(this, _clearError);

    _classPrivateMethodInitSpec(this, _showError);

    _classPrivateMethodInitSpec(this, _makeValues);

    _classPrivateFieldInitSpec(this, _attribute, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _ROOT$8, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _LOADING_VIEW$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _SELECT_CONTAINER, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _OVERVIEW_CONTAINER, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _CHECKBOX_ALL_PROPERTIES, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _COLLAPSE_BUTTON, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _attribute, Records$1.getAttribute(attributeId));

    _classPrivateFieldSet(this, _ROOT$8, document.createElement('div'));

    container.insertAdjacentElement('beforeend', _classPrivateFieldGet(this, _ROOT$8));
    var category = Records$1.getCatexxxgoryWithAttributeId(attributeId);

    _classPrivateFieldGet(this, _ROOT$8).classList.add('attribute-track-view', '-preparing', 'collapse-view');

    _classPrivateFieldGet(this, _ROOT$8).dataset.catexxxgoryId = category.id;
    _classPrivateFieldGet(this, _ROOT$8).dataset.collapse = attributeId; // make html

    _classPrivateFieldGet(this, _ROOT$8).innerHTML = "\n    <div class=\"row -upper\">\n      <div class=\"left definition\">\n        <div class=\"collapsebutton\" data-collapse=\"".concat(attributeId, "\">\n          <input type=\"checkbox\" class=\"mapping\">\n          <h2 class=\"title _catexxxgory-color\">").concat(_classPrivateFieldGet(this, _attribute).label, "</h2>\n        </div>\n      </div>\n      <div class=\"right values\">\n        <div class=\"overview _catexxxgory-background-color\">\n          <ul class=\"inner\"></ul>\n          <div class=\"loading-view -shown\"></div>\n        </div>\n      </div>\n    </div>\n    <div class=\"row -lower collapsingcontent\" data-collapse=\"").concat(attributeId, "\">\n      <div class=\"left\">\n        <dl class=\"specification\">\n          <dt>Description</dt>\n          <dd>").concat(_classPrivateFieldGet(this, _attribute).description, "</dd>\n          <dt>API</dt>\n          <dd><a href=\"").concat(_classPrivateFieldGet(this, _attribute).api, "\" target=\"_blank\">").concat(_classPrivateFieldGet(this, _attribute).api, "</a></dd>\n        </dl>\n        ").concat(_classPrivateFieldGet(this, _attribute).source.map(function (source) {
      return "<dl class=\"source\">\n        <dt>Original data</dt>\n          <dd><a href=\"".concat(source.url, "\" target=\"_blank\">").concat(source.label, "</a></dd>\n          <dt>Version</dt>\n          <dd>").concat(source.version, "</dd>\n          <dt>Last updated</dt>\n          <dd>").concat(source.updated, "</dd>\n        </dl>");
    }).join(''), "\n      </div>\n      <div class=\"right selector\"></div>\n    </div>");

    var valuesContainer = _classPrivateFieldGet(this, _ROOT$8).querySelector(':scope > .row.-upper > .values');

    _classPrivateFieldSet(this, _OVERVIEW_CONTAINER, valuesContainer.querySelector(':scope > .overview > .inner'));

    _classPrivateFieldSet(this, _LOADING_VIEW$1, valuesContainer.querySelector(':scope > .overview > .loading-view'));

    _classPrivateFieldSet(this, _SELECT_CONTAINER, _classPrivateFieldGet(this, _ROOT$8).querySelector(':scope > .row.-lower > .selector'));

    _classPrivateFieldSet(this, _COLLAPSE_BUTTON, _classPrivateFieldGet(this, _ROOT$8).querySelector(':scope > .row.-upper > .left > .collapsebutton')); // collapse


    collapseView(_classPrivateFieldGet(this, _ROOT$8)); // select/deselect a property

    _classPrivateFieldSet(this, _CHECKBOX_ALL_PROPERTIES, _classPrivateFieldGet(this, _ROOT$8).querySelector(':scope > .row.-upper > .left > .collapsebutton > input.mapping'));

    _classPrivateFieldGet(this, _CHECKBOX_ALL_PROPERTIES).addEventListener('click', function (e) {
      e.stopPropagation();

      if (_classPrivateFieldGet(_this, _CHECKBOX_ALL_PROPERTIES).checked) {
        // add
        ConditionBuilder$1.addAttribute(attributeId);

        _classPrivateFieldGet(_this, _ROOT$8).classList.add('-allselected');
      } else {
        // remove
        ConditionBuilder$1.removeAttribute(attributeId);

        _classPrivateFieldGet(_this, _ROOT$8).classList.remove('-allselected');
      }
    }); // event listener


    DefaultEventEmitter$1.addEventListener(mutateAttributeCondition, function (_ref) {
      var _ref$detail = _ref.detail,
          action = _ref$detail.action,
          keyCondition = _ref$detail.keyCondition;
      if (keyCondition.parentCategoryId !== undefined) return;

      switch (action) {
        case 'add':
          if (keyCondition.attributeId === attributeId) {
            _classPrivateFieldGet(_this, _CHECKBOX_ALL_PROPERTIES).checked = true;

            _classPrivateFieldGet(_this, _ROOT$8).classList.add('-allselected');
          }

          break;

        case 'remove':
          if (keyCondition.attributeId === attributeId) {
            _classPrivateFieldGet(_this, _CHECKBOX_ALL_PROPERTIES).checked = false;

            _classPrivateFieldGet(_this, _ROOT$8).classList.remove('-allselected');
          }

          break;
      }
    });
    DefaultEventEmitter$1.addEventListener(allTracksCollapse, function (e) {
      if (e.detail) {
        if (!_classPrivateFieldGet(_this, _ROOT$8).classList.contains('-spread')) {
          _classPrivateFieldGet(_this, _COLLAPSE_BUTTON).dispatchEvent(new MouseEvent('click'));
        }
      } else {
        if (_classPrivateFieldGet(_this, _ROOT$8).classList.contains('-spread')) {
          _classPrivateFieldGet(_this, _COLLAPSE_BUTTON).dispatchEvent(new MouseEvent('click'));
        }
      }
    });
    DefaultEventEmitter$1.addEventListener(toggleErrorUserValues, function (e) {
      if (e.detail.mode === 'show') {
        if (e.detail.attributeId !== attributeId) return;

        _classPrivateMethodGet(_this, _showError, _showError2).call(_this, e.detail.message, true);
      } else if (e.detail.mode === 'hide') _classPrivateMethodGet(_this, _clearError, _clearError2).call(_this);
    }); // get property data

    Records$1.fetchAttributeValues(attributeId).then(function (values) {
      return _classPrivateMethodGet(_this, _makeValues, _makeValues2).call(_this, values);
    }).catch(function (error) {
      _classPrivateMethodGet(_this, _showError, _showError2).call(_this, error);
    }).finally(function () {
      _classPrivateFieldGet(_this, _LOADING_VIEW$1).classList.remove('-shown');
    });
  } // private methods
  );

  function _makeValues2(values) {
    _classPrivateFieldGet(this, _ROOT$8).classList.remove('-preparing'); // make overview


    new TrackOverviewCategorical(_classPrivateFieldGet(this, _OVERVIEW_CONTAINER), _classPrivateFieldGet(this, _attribute), values); // make selector view

    switch (_classPrivateFieldGet(this, _attribute).datamodel) {
      case 'classification':
        new ColumnSelectorView(_classPrivateFieldGet(this, _SELECT_CONTAINER), _classPrivateFieldGet(this, _attribute), values);
        break;

      case 'distribution':
        new HistogramRangeSelectorView(_classPrivateFieldGet(this, _SELECT_CONTAINER), _classPrivateFieldGet(this, _attribute), values);
        break;
    }
  }

  function _showError2(error) {
    var _classPrivateFieldGet2;

    var inUserIDs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (inUserIDs && (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _OVERVIEW_CONTAINER).nextElementSibling) !== null && _classPrivateFieldGet2 !== void 0 && _classPrivateFieldGet2.classList.contains('error')) return;

    var prop = _classPrivateFieldGet(this, _attribute).api;

    _classPrivateFieldGet(this, _OVERVIEW_CONTAINER).insertAdjacentHTML('afterEnd', "<div class=\"".concat(inUserIDs ? 'map-ids ' : '', "error\">").concat(error, " - <a href=\"").concat(prop, "\" target=\"_blank\">").concat(prop, "</a></div>"));

    if (inUserIDs) _classPrivateFieldGet(this, _OVERVIEW_CONTAINER).classList.add('-hidden');
  }

  function _clearError2() {
    var _classPrivateFieldGet3;

    _classPrivateFieldGet(this, _OVERVIEW_CONTAINER).classList.remove('-hidden');

    (_classPrivateFieldGet3 = _classPrivateFieldGet(this, _OVERVIEW_CONTAINER).parentNode.querySelector(':scope > .map-ids.error')) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.remove();
  }

  var CategoryView = /*#__PURE__*/_createClass(function CategoryView(category, elm) {
    _classCallCheck(this, CategoryView);

    elm.classList.add('category-view');
    elm.innerHTML = "\n    <h3 class=\"title _catexxxgory-background-color-strong\" data-catexxxgory-id=\"".concat(category.id, "\">\n      <span>").concat(category.label, "</span>\n    </h3>\n    <div class=\"attributes\"></div>"); // make tracks

    var attributes = category.attributes;
    var attributesContainer = elm.querySelector(':scope > .attributes');

    for (var i = 0; i < attributes.length; i++) {
      var attribute = attributes[i];
      new AttributeTrackView(attribute, attributesContainer, i / attributes.length);
    }
  });

  var _index = /*#__PURE__*/new WeakMap();

  var _attributeId = /*#__PURE__*/new WeakMap();

  var _tableData$2 = /*#__PURE__*/new WeakMap();

  var _referenceValues = /*#__PURE__*/new WeakMap();

  var _BARS = /*#__PURE__*/new WeakMap();

  var _ROOT$7 = /*#__PURE__*/new WeakMap();

  var _ROOT_NODE = /*#__PURE__*/new WeakMap();

  var _draw = /*#__PURE__*/new WeakSet();

  var _failedFetchTableDataIds = /*#__PURE__*/new WeakSet();

  var StatisticsView = /*#__PURE__*/function () {
    function StatisticsView(statisticsRootNode, elm, tableData, index, condition) {
      _classCallCheck(this, StatisticsView);

      _classPrivateMethodInitSpec(this, _failedFetchTableDataIds);

      _classPrivateMethodInitSpec(this, _draw);

      _classPrivateFieldInitSpec(this, _index, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _attributeId, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _tableData$2, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _referenceValues, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _BARS, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _ROOT$7, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _ROOT_NODE, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(this, _index, index);

      _classPrivateFieldSet(this, _attributeId, condition.attributeId);

      _classPrivateFieldSet(this, _tableData$2, tableData);

      _classPrivateFieldSet(this, _ROOT_NODE, statisticsRootNode);

      _classPrivateFieldSet(this, _ROOT$7, elm);

      elm.classList.add('statistics-view');
      elm.dataset.catexxxgoryId = condition.catexxxgoryId; // make HTML

      elm.innerHTML = "\n    <div class=\"statistics\">\n      <div class=\"bars\"></div>\n    </div>\n    <div class=\"loading-view -shown\"></div>\n    "; // display order of bar chart

      if (condition.parentCategoryId) {
        _classPrivateFieldSet(this, _referenceValues, Records$1.getValuesWithParentCategoryId(_classPrivateFieldGet(this, _attributeId), condition.parentCategoryId));
      } else {
        _classPrivateFieldSet(this, _referenceValues, Records$1.getAttribute(_classPrivateFieldGet(this, _attributeId)).values);
      } // references


      var container = elm.querySelector(':scope > .statistics');

      _classPrivateFieldSet(this, _BARS, container.querySelector(':scope > .bars')); // event listener


      DefaultEventEmitter$1.addEventListener(addNextRows, _classPrivateMethodGet(this, _draw, _draw2).bind(this));
      DefaultEventEmitter$1.addEventListener(changeStatisticsViewMode, _classPrivateMethodGet(this, _draw, _draw2).bind(this));
      DefaultEventEmitter$1.addEventListener(failedFetchTableDataIds, _classPrivateMethodGet(this, _failedFetchTableDataIds, _failedFetchTableDataIds2).bind(this));
    }

    _createClass(StatisticsView, [{
      key: "destroy",
      value: function destroy() {
        DefaultEventEmitter$1.removeEventListener(addNextRows, _classPrivateMethodGet(this, _draw, _draw2).bind(this));
        DefaultEventEmitter$1.removeEventListener(changeStatisticsViewMode, _classPrivateMethodGet(this, _draw, _draw2).bind(this));
        DefaultEventEmitter$1.removeEventListener(failedFetchTableDataIds, _classPrivateMethodGet(this, _failedFetchTableDataIds, _failedFetchTableDataIds2).bind(this));
      }
      /**
       * @param {TableData} detail.tableData
       * @param {Array} detail.rows
       * @param {Boolean} detail.done
       */

    }]);

    return StatisticsView;
  }();

  function _draw2(e) {
    var _this = this,
        _e$detail;

    var attributes = _.uniqBy(_classPrivateFieldGet(this, _tableData$2).data.map(function (datum) {
      return datum.properties[_classPrivateFieldGet(_this, _index)];
    }).filter(function (property) {
      return property !== undefined;
    }).map(function (property) {
      return property.attributes;
    }).flat(), 'id').map(function (property) {
      return property.attribute;
    });

    var hitVlues = [];

    _classPrivateFieldGet(this, _referenceValues).forEach(function (_ref) {
      var categoryId = _ref.categoryId,
          label = _ref.label,
          count = _ref.count;
      var filtered = attributes.filter(function (attribute) {
        return attribute.categoryId === categoryId;
      });
      if (filtered.length === 0) return;
      hitVlues.push({
        categoryId: categoryId,
        label: label,
        count: count,
        hitCount: filtered.length
      });
    }); // max


    var countMax;

    var isOnlyHitCount = _classPrivateFieldGet(this, _ROOT_NODE).classList.contains('-onlyhitcount');

    var isStretch = !isOnlyHitCount && _classPrivateFieldGet(this, _ROOT_NODE).classList.contains('-stretch');

    if (isOnlyHitCount) {
      countMax = Math.max.apply(Math, _toConsumableArray(hitVlues.map(function (value) {
        return value.hitCount;
      })));
    } else {
      countMax = Math.max.apply(Math, _toConsumableArray(hitVlues.map(function (value) {
        return value.count;
      })));
    }

    hitVlues.reduce(function (lastBar, _ref2) {
      var categoryId = _ref2.categoryId,
          label = _ref2.label,
          count = _ref2.count,
          hitCount = _ref2.hitCount;

      var bar = _classPrivateFieldGet(_this, _BARS).querySelector(":scope > .bar[data-category-id=\"".concat(categoryId, "\"]"));

      if (bar === null) {
        // add bar
        bar = document.createElement('div');
        bar.classList.add('bar');
        bar.dataset.categoryId = categoryId;
        bar.innerHTML = "\n        <div class=\"wholebar\"></div>\n        <div class=\"hitbar _catexxxgory-background-color-strong\">\n          <div class=\"value\"></div>\n        </div>\n        <div class=\"label\">".concat(label, "</div>");

        if (lastBar) {
          lastBar.after(bar);
        } else {
          _classPrivateFieldGet(_this, _BARS).append(bar);
        }
      } // styling


      bar.querySelector(':scope > .wholebar').style.height = "".concat(count / countMax * 100, "%");
      var hitbar = bar.querySelector(':scope > .hitbar');
      var hitCountLabel = hitbar.querySelector(':scope > .value');
      var hitbarHeight;

      if (isStretch) {
        hitbarHeight = hitCount / count;
        hitCountLabel.textContent = "".concat(Math.round(hitCount / count * 100), "%");
      } else {
        hitbarHeight = hitCount / countMax;
        hitCountLabel.textContent = hitCount.toLocaleString();
      }

      hitbar.style.height = "".concat(hitbarHeight * 100, "%");

      if (hitbarHeight < .5) {
        hitCountLabel.classList.add('-below');
      } else {
        hitCountLabel.classList.remove('-below');
      }

      return bar;
    }, undefined);

    if (e !== null && e !== void 0 && (_e$detail = e.detail) !== null && _e$detail !== void 0 && _e$detail.done) {
      _classPrivateFieldGet(this, _ROOT$7).classList.add('-completed');

      _classPrivateFieldGet(this, _ROOT$7).querySelector(':scope > .loading-view').classList.remove('-shown');
    }
  }

  function _failedFetchTableDataIds2() {
    _classPrivateFieldGet(this, _ROOT$7).querySelector(':scope > .loading-view').classList.remove('-shown');
  }

  var _intersctionObserver = /*#__PURE__*/new WeakMap();

  var _tableData$1 = /*#__PURE__*/new WeakMap();

  var _header$1 = /*#__PURE__*/new WeakMap();

  var _hea___der = /*#__PURE__*/new WeakMap();

  var _statisticsViews = /*#__PURE__*/new WeakMap();

  var _ROOT$6 = /*#__PURE__*/new WeakMap();

  var _THEAD = /*#__PURE__*/new WeakMap();

  var _THEAD_SUB = /*#__PURE__*/new WeakMap();

  var _STATS = /*#__PURE__*/new WeakMap();

  var _TBODY = /*#__PURE__*/new WeakMap();

  var _TABLE_END = /*#__PURE__*/new WeakMap();

  var _LOADING_VIEW = /*#__PURE__*/new WeakMap();

  var _enterTableEnd = /*#__PURE__*/new WeakSet();

  var _setupTable = /*#__PURE__*/new WeakSet();

  var _addTableRows = /*#__PURE__*/new WeakSet();

  var _failed = /*#__PURE__*/new WeakSet();

  var _colHighlight = /*#__PURE__*/new WeakSet();

  var ResultsTable = /*#__PURE__*/_createClass(function ResultsTable(elm) {
    var _this = this,
        _controller$querySele;

    _classCallCheck(this, ResultsTable);

    _classPrivateMethodInitSpec(this, _colHighlight);

    _classPrivateMethodInitSpec(this, _failed);

    _classPrivateMethodInitSpec(this, _addTableRows);

    _classPrivateMethodInitSpec(this, _setupTable);

    _classPrivateMethodInitSpec(this, _enterTableEnd);

    _classPrivateFieldInitSpec(this, _intersctionObserver, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _tableData$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _header$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _hea___der, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _statisticsViews, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _ROOT$6, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _THEAD, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _THEAD_SUB, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _STATS, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _TBODY, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _TABLE_END, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _LOADING_VIEW, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _statisticsViews, []); // references


    _classPrivateFieldSet(this, _ROOT$6, elm);

    var TABLE = elm.querySelector(':scope > .body > table');

    _classPrivateFieldSet(this, _THEAD, TABLE.querySelector(':scope > thead > tr.header'));

    _classPrivateFieldSet(this, _THEAD_SUB, TABLE.querySelector(':scope > thead > tr.subheader'));

    _classPrivateFieldSet(this, _STATS, TABLE.querySelector(':scope > thead > tr.statistics'));

    _classPrivateFieldSet(this, _TBODY, TABLE.querySelector(':scope > tbody'));

    _classPrivateFieldSet(this, _TABLE_END, elm.querySelector(':scope > .body > .tableend'));

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


    DefaultEventEmitter$1.addEventListener(selectTableData, function (e) {
      return _classPrivateMethodGet(_this, _setupTable, _setupTable2).call(_this, e.detail);
    });
    DefaultEventEmitter$1.addEventListener(addNextRows, function (e) {
      return _classPrivateMethodGet(_this, _addTableRows, _addTableRows2).call(_this, e.detail);
    });
    DefaultEventEmitter$1.addEventListener(failedFetchTableDataIds, function (e) {
      return _classPrivateMethodGet(_this, _failed, _failed2).call(_this, e.detail);
    });
    DefaultEventEmitter$1.addEventListener(highlightCol, function (e) {
      _classPrivateMethodGet(_this, _colHighlight, _colHighlight2).call(_this, e.detail);
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
    }); // statistics

    var controller = _classPrivateFieldGet(this, _STATS).querySelector(':scope > th.controller > .inner');

    controller.querySelectorAll(':scope > label > input').forEach(function (radio) {
      radio.addEventListener('change', function () {
        switch (radio.value) {
          case 'hits_all':
            _classPrivateFieldGet(_this, _STATS).classList.remove('-onlyhitcount');

            _classPrivateFieldGet(_this, _STATS).classList.remove('-stretch');

            break;

          case 'hits_all_percentage':
            _classPrivateFieldGet(_this, _STATS).classList.remove('-onlyhitcount');

            _classPrivateFieldGet(_this, _STATS).classList.add('-stretch');

            break;

          case 'hits_only':
            _classPrivateFieldGet(_this, _STATS).classList.add('-onlyhitcount');

            _classPrivateFieldGet(_this, _STATS).classList.remove('-stretch');

            break;
        }

        var customEvent = new CustomEvent(changeStatisticsViewMode);
        DefaultEventEmitter$1.dispatchEvent(customEvent);
        window.localStorage.setItem('statistics_view_moe', radio.value);
      });
    });
    var statisticsViewMoe = window.localStorage.getItem('statistics_view_moe');
    (_controller$querySele = controller.querySelector(":scope > label > input[value=\"".concat(statisticsViewMoe, "\"]"))) === null || _controller$querySele === void 0 ? void 0 : _controller$querySele.dispatchEvent(new MouseEvent('click'));
  } // private methods
  );

  function _enterTableEnd2() {
    _classPrivateFieldGet(this, _intersctionObserver).unobserve(_classPrivateFieldGet(this, _TABLE_END));

    _classPrivateFieldGet(this, _tableData$1).next();
  }

  function _setupTable2(tableData) {
    var _this2 = this;

    // reset
    _classPrivateFieldSet(this, _tableData$1, tableData);

    _classPrivateFieldGet(this, _intersctionObserver).unobserve(_classPrivateFieldGet(this, _TABLE_END));

    _classPrivateFieldSet(this, _header$1, [].concat(_toConsumableArray(tableData.dxCondition.valuesConditions.map(function (_ref) {
      var catexxxgoryId = _ref.catexxxgoryId,
          attributeId = _ref.attributeId;
      return {
        catexxxgoryId: catexxxgoryId,
        attributeId: attributeId
      };
    })), _toConsumableArray(tableData.dxCondition.keyConditions.map(function (_ref2) {
      var catexxxgoryId = _ref2.catexxxgoryId,
          attributeId = _ref2.attributeId;
      return {
        catexxxgoryId: catexxxgoryId,
        attributeId: attributeId
      };
    }))));

    _classPrivateFieldGet(this, _ROOT$6).classList.remove('-complete');

    _classPrivateFieldGet(this, _THEAD).innerHTML = '';
    _classPrivateFieldGet(this, _TBODY).innerHTML = '';

    _classPrivateFieldGet(this, _LOADING_VIEW).classList.add('-shown');

    DefaultEventEmitter$1.dispatchEvent(new CustomEvent(hideStanza)); // make table header

    _classPrivateFieldGet(this, _THEAD).innerHTML = "\n      <th rowspan=\"2\">\n        <div class=\"inner\">\n          <div class=\"togo-key-view\">".concat(Records$1.getDatasetLabel(tableData.togoKey), "</div>\n        </div>\n      </th>\n      <th colspan=\"100%\">\n        <div class=\"inner -noborder\"></div>\n      </th>\n      "); // makte table sub header

    _classPrivateFieldGet(this, _THEAD_SUB).innerHTML = "\n    ".concat(tableData.dxCondition.valuesConditions.map(function (valuesCondition) {
      return "\n          <th>\n            <div class=\"inner _catexxxgory-background-color\" data-catexxxgory-id=\"".concat(valuesCondition.catexxxgoryId, "\">\n              <div class=\"togo-key-view\">").concat(Records$1.getDatasetLabel(valuesCondition.dataset), "</div>\n              <span>").concat(valuesCondition.label, "</span>\n            </div>\n          </th>");
    }).join(''), "\n    ").concat(tableData.dxCondition.keyConditions.map(function (keyCondition) {
      return "\n          <th>\n            <div class=\"inner _catexxxgory-color\" data-catexxxgory-id=\"".concat(keyCondition.catexxxgoryId, "\">\n              <div class=\"togo-key-view\">").concat(Records$1.getDatasetLabel(keyCondition.dataset), "</div>\n              <span>").concat(keyCondition.label, "</span>\n            </div>\n          </th>");
    }).join('')); // make stats

    var _iterator2 = _createForOfIteratorHelper(_classPrivateFieldGet(this, _STATS).querySelectorAll(':scope > td')),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var td = _step2.value;
        td.remove();
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    var _iterator3 = _createForOfIteratorHelper(_classPrivateFieldGet(this, _statisticsViews)),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var statisticsView = _step3.value;
        statisticsView.destroy();
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    _classPrivateFieldSet(this, _statisticsViews, []);

    _classPrivateFieldGet(this, _tableData$1).dxCondition;
    var conditions = [].concat(_toConsumableArray(_classPrivateFieldGet(this, _tableData$1).dxCondition.valuesConditions), _toConsumableArray(_classPrivateFieldGet(this, _tableData$1).dxCondition.keyConditions));
    conditions.forEach(function (condition, index) {
      var td = document.createElement('td');
      td.innerHTML = '<div class="inner"><div></div></div>';

      _classPrivateFieldGet(_this2, _STATS).append(td);

      _classPrivateFieldGet(_this2, _statisticsViews).push(new StatisticsView(_classPrivateFieldGet(_this2, _STATS), td.querySelector(':scope > .inner > div'), tableData, index, condition));
    });
  }

  function _addTableRows2(_ref3) {
    var _this3 = this;

    var done = _ref3.done,
        offset = _ref3.offset,
        rows = _ref3.rows,
        tableData = _ref3.tableData;

    _classPrivateFieldSet(this, _tableData$1, tableData); // make table


    _classPrivateFieldGet(this, _TBODY).insertAdjacentHTML('beforeend', rows.map(function (row, index) {
      return "\n          <tr\n            data-index=\"".concat(offset + index, "\"\n            data-togo-id=\"").concat(row.id, "\">\n            <td>\n              <div class=\"inner\">\n                <ul>\n                  <div\n                    class=\"togo-key-view primarykey\"\n                    data-key=\"").concat(tableData.togoKey, "\"\n                    data-order=\"").concat([0, offset + index], "\"\n                    data-sub-order=\"0\"\n                    data-subject-id=\"primary\"\n                    data-unique-entry-id=\"").concat(row.id, "\">").concat(row.id, "\n                  </div>\n                  <span>").concat(row.label, "</span>\n                </ul>\n              </div<\n            </td>\n            ").concat(row.properties.map(function (column, columnIndex) {
        if (column) {
          return "\n                  <td><div class=\"inner\"><ul>".concat(column.attributes.map(function (attribute, attributeIndex) {
            if (!attribute.attribute) console.error(attribute);
            return "\n                      <li>\n                        <div\n                          class=\"togo-key-view\"\n                          data-order=\"".concat([columnIndex + 1, offset + index], "\"\n                          data-sub-order=\"").concat(attributeIndex, "\"\n                          data-key=\"").concat(column.propertyKey, "\"\n                          data-subject-id=\"").concat(_classPrivateFieldGet(_this3, _header$1)[columnIndex].catexxxgoryId, "\"\n                          data-main-category-id=\"").concat(_classPrivateFieldGet(_this3, _header$1)[columnIndex].attributeId, "\"\n                          data-sub-category-id=\"").concat(attribute.attribute.categoryId ? attribute.attribute.categoryId : attribute.attribute.categoryIds, "\"\n                          data-unique-entry-id=\"").concat(attribute.id, "\"\n                          >").concat(attribute.id, "</div>\n                        <span>").concat(attribute.attribute ? attribute.attribute.label : attribute, "</span>\n                      </li>");
          }).join(''), "</ul></div></td>");
        } else {
          return "<td><div class=\"inner -empty\"></div></td>";
        }
      }).join(''), "\n          </tr>");
    }).join('')); // turn off auto-loading after last line is displayed


    if (done) {
      _classPrivateFieldGet(this, _ROOT$6).classList.add('-complete');

      _classPrivateFieldGet(this, _LOADING_VIEW).classList.remove('-shown');
    } else {
      _classPrivateFieldGet(this, _ROOT$6).classList.remove('-complete');

      _classPrivateFieldGet(this, _LOADING_VIEW).classList.add('-shown');

      _classPrivateFieldGet(this, _intersctionObserver).observe(_classPrivateFieldGet(this, _TABLE_END));
    } // Naming needs improvement but hierarcy for Popup screen is like below
    // Togo-key   (Uniprot)                        | primaryKey
    //  → Subject  (Gene)                          | category
    //    → Main-Category  (Expressed in tissues)  | attribute
    //      → Sub-Category  (Thyroid Gland)        | 
    //        → Unique-Entry (ENSG00000139304)     | categoryId ?


    rows.forEach(function (row, index) {
      var actualIndex = offset + index;

      var tr = _classPrivateFieldGet(_this3, _TBODY).querySelector(":scope > tr[data-index=\"".concat(actualIndex, "\"]"));

      var uniqueEntries = tr.querySelectorAll('.togo-key-view');
      uniqueEntries.forEach(function (uniqueEntry) {
        uniqueEntry.addEventListener('click', function () {
          createPopupEvent(uniqueEntry, showPopup);
        }); // remove highlight on mouseleave only when there is no popup

        var td = uniqueEntry.closest('td');
        td.addEventListener('mouseenter', function () {
          var customEvent = new CustomEvent(highlightCol, {
            detail: uniqueEntry.getAttribute('data-order').split(',')[0]
          });
          DefaultEventEmitter$1.dispatchEvent(customEvent);
        });
        td.addEventListener('mouseleave', function () {
          if (document.querySelector('#ResultDetailModal').innerHTML === '') {
            _classPrivateFieldGet(_this3, _TBODY).querySelectorAll('td').forEach(function (td) {
              return td.classList.remove('-selected');
            });
          }
        });
      });
    });
  }

  function _failed2(tableData) {
    _classPrivateFieldGet(this, _ROOT$6).classList.add('-complete');

    _classPrivateFieldGet(this, _LOADING_VIEW).classList.remove('-shown');
  }

  function _colHighlight2(colIndex) {
    _classPrivateFieldGet(this, _TBODY).querySelectorAll('[data-order]').forEach(function (element) {
      var td = element.closest('td');

      if (element.getAttribute('data-order').split(',')[0] === colIndex) {
        if (!td.classList.contains('.-selected')) {
          td.classList.add('-selected');
        }
      } else {
        td.classList.remove('-selected');
      }
    });
  }

  var _templates = /*#__PURE__*/new WeakMap();

  var _isReady = /*#__PURE__*/new WeakMap();

  var StanzaManager = /*#__PURE__*/function () {
    function StanzaManager() {
      _classCallCheck(this, StanzaManager);

      _classPrivateFieldInitSpec(this, _templates, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _isReady, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(this, _isReady, false);
    }

    _createClass(StanzaManager, [{
      key: "init",
      value: function init(data) {
        var _this = this;

        // embed modules
        var head = document.querySelector('head');
        data.stanzas.forEach(function (stanza) {
          var script = document.createElement('script');
          script.setAttribute('type', 'module');
          script.setAttribute('src', stanza);
          script.setAttribute('async', 1);
          head.appendChild(script);
        }); // fetch templates

        Promise.all(Object.keys(data.templates).map(function (key) {
          return fetch(data.templates[key]);
        })).then(function (responces) {
          return Promise.all(responces.map(function (responce) {
            return responce.text();
          }));
        }).then(function (templates) {
          // set stanza templates
          _classPrivateFieldSet(_this, _templates, Object.fromEntries(Object.keys(data.templates).map(function (stanza, index) {
            return [stanza, templates[index]];
          })));

          _classPrivateFieldSet(_this, _isReady, true);
        });
      }
      /**˝
       * @param {String} key  key of Database used to get template
       * @param {String} id  ID of dataset
       * @returns {String} HTML
       */

    }, {
      key: "draw",
      value: function draw(key, id) {
        return "<div class=\"stanza\">".concat(_classPrivateFieldGet(this, _templates)[key].replace(/{{id}}/g, id), "</div>");
      }
    }, {
      key: "isReady",
      get: function get() {
        return _classPrivateFieldGet(this, _isReady);
      }
    }]);

    return StanzaManager;
  }();

  var StanzaManager$1 = new StanzaManager();

  var x = 0;
  var y = 0;
  function dragView(view) {
    x = view.x;
    y = view.y;
    document.addEventListener('mousemove', elementDrag);
    document.addEventListener('mouseup', closeDrag);

    function elementDrag(e) {
      var dx = e.clientX - x;
      var dy = e.clientY - y;
      var container = view.container;
      container.style.top = "".concat(container.offsetTop + dy, "px");
      container.style.left = "".concat(container.offsetLeft + dx, "px");
      x = e.clientX;
      y = e.clientY;
    }

    function closeDrag() {
      document.removeEventListener('mousemove', elementDrag);
      document.removeEventListener('mouseup', closeDrag);
    }
  }

  var _ROOT$5 = /*#__PURE__*/new WeakMap();

  var _RESULTS_TABLE = /*#__PURE__*/new WeakMap();

  var _RESULT_MODAL = /*#__PURE__*/new WeakMap();

  var _exit_button = /*#__PURE__*/new WeakMap();

  var _popup_top = /*#__PURE__*/new WeakMap();

  var _popup_left = /*#__PURE__*/new WeakMap();

  var _showPopup = /*#__PURE__*/new WeakSet();

  var _popup = /*#__PURE__*/new WeakSet();

  var _header = /*#__PURE__*/new WeakSet();

  var _container = /*#__PURE__*/new WeakSet();

  var _stanzas = /*#__PURE__*/new WeakSet();

  var _arrow = /*#__PURE__*/new WeakSet();

  var _setHighlight = /*#__PURE__*/new WeakSet();

  var _handleKeydown = /*#__PURE__*/new WeakMap();

  var _arrowFuncs = /*#__PURE__*/new WeakMap();

  var _setMovementArrow = /*#__PURE__*/new WeakSet();

  var _getTargetEntry = /*#__PURE__*/new WeakSet();

  var _entriesByAxes = /*#__PURE__*/new WeakSet();

  var _hidePopup = /*#__PURE__*/new WeakSet();

  var ResultDetailModal = /*#__PURE__*/_createClass(function ResultDetailModal() {
    var _this = this;

    _classCallCheck(this, ResultDetailModal);

    _classPrivateMethodInitSpec(this, _hidePopup);

    _classPrivateMethodInitSpec(this, _entriesByAxes);

    _classPrivateMethodInitSpec(this, _getTargetEntry);

    _classPrivateMethodInitSpec(this, _setMovementArrow);

    _classPrivateMethodInitSpec(this, _setHighlight);

    _classPrivateMethodInitSpec(this, _arrow);

    _classPrivateMethodInitSpec(this, _stanzas);

    _classPrivateMethodInitSpec(this, _container);

    _classPrivateMethodInitSpec(this, _header);

    _classPrivateMethodInitSpec(this, _popup);

    _classPrivateMethodInitSpec(this, _showPopup);

    _classPrivateFieldInitSpec(this, _ROOT$5, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _RESULTS_TABLE, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _RESULT_MODAL, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _exit_button, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _popup_top, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _popup_left, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _handleKeydown, {
      writable: true,
      value: function value(e) {
        if (e.key == 'Escape') {
          DefaultEventEmitter$1.dispatchEvent(new CustomEvent(hidePopup));
        } else if (_classPrivateFieldGet(_this, _arrowFuncs).has(e.key)) {
          e.preventDefault();

          _classPrivateFieldGet(_this, _RESULT_MODAL).querySelector(".arrow.-".concat(e.key.replace('Arrow', '').toLowerCase())).click();
        }
      }
    });

    _classPrivateFieldInitSpec(this, _arrowFuncs, {
      writable: true,
      value: new Map([['ArrowLeft', function (x, y) {
        return [x - 1, y];
      }], ['ArrowRight', function (x, y) {
        return [x + 1, y];
      }], ['ArrowUp', function (x) {
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
        return [x, y - 1];
      }], ['ArrowDown', function (x) {
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
        return [x, y + 1];
      }]])
    });

    _classPrivateFieldSet(this, _ROOT$5, document.createElement('section'));

    _classPrivateFieldGet(this, _ROOT$5).id = 'ResultDetailModal';
    document.querySelector('body').insertAdjacentElement('beforeend', _classPrivateFieldGet(this, _ROOT$5)); // references

    _classPrivateFieldSet(this, _RESULTS_TABLE, document.querySelector('#ResultsTable'));

    _classPrivateFieldSet(this, _RESULT_MODAL, document.querySelector('#ResultDetailModal'));

    _classPrivateFieldSet(this, _exit_button, document.createElement('div'));

    _classPrivateFieldGet(this, _exit_button).className = 'close-button-view'; // attach event

    DefaultEventEmitter$1.addEventListener(showPopup, function (e) {
      _classPrivateMethodGet(_this, _showPopup, _showPopup2).call(_this, e);
    });
    DefaultEventEmitter$1.addEventListener(movePopup, function (e) {
      _classPrivateMethodGet(_this, _hidePopup, _hidePopup2).call(_this, false);

      _classPrivateMethodGet(_this, _showPopup, _showPopup2).call(_this, e);
    });
    DefaultEventEmitter$1.addEventListener(dragElement, function (e) {
      dragView(e.detail);
    });
    DefaultEventEmitter$1.addEventListener(hidePopup, function () {
      _classPrivateMethodGet(_this, _hidePopup, _hidePopup2).call(_this);
    });

    _classPrivateFieldGet(this, _RESULT_MODAL).addEventListener('click', function (e) {
      if (e.target !== e.currentTarget) return;
      DefaultEventEmitter$1.dispatchEvent(new CustomEvent(hidePopup));
    });

    _classPrivateFieldGet(this, _exit_button).addEventListener('click', function () {
      DefaultEventEmitter$1.dispatchEvent(new CustomEvent(hidePopup));
    });
  } // bind this on handleKeydown so it will keep listening to same event during the whole popup
  );

  function _showPopup2(e) {
    _classPrivateMethodGet(this, _setHighlight, _setHighlight2).call(this, e.detail.properties.dataX, e.detail.properties.dataY, e.detail.properties.dataSubOrder);

    _classPrivateFieldSet(this, _handleKeydown, _classPrivateFieldGet(this, _handleKeydown).bind(this));

    document.addEventListener('keydown', _classPrivateFieldGet(this, _handleKeydown));

    _classPrivateFieldGet(this, _RESULT_MODAL).appendChild(_classPrivateMethodGet(this, _popup, _popup2).call(this, e.detail));

    _classPrivateFieldGet(this, _RESULT_MODAL).classList.add('backdrop');
  }

  function _popup2(detail) {
    _classPrivateFieldGet(this, _ROOT$5).dataset.catexxxgoryId = detail.keys.subjectId;
    var popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.left = _classPrivateFieldGet(this, _popup_left);
    popup.style.top = _classPrivateFieldGet(this, _popup_top);
    popup.appendChild(_classPrivateMethodGet(this, _header, _header2).call(this, detail.keys, detail.properties));
    popup.appendChild(_classPrivateMethodGet(this, _container, _container2).call(this, detail.keys, detail.properties));
    return popup;
  }

  function _header2(keys, props) {
    var category = Records$1.getCatexxxgory(keys.subjectId);
    var attribute = Records$1.getAttribute(keys.mainCategoryId);
    var isPrimaryKey = props.isPrimaryKey;
    var mainCategory = isPrimaryKey ? '' : Records$1.getAttribute(keys.mainCategoryId);
    var categoryLabel = isPrimaryKey ? keys.dataKey : "<span class=\"category _catexxxgory-background-color-strong\">".concat(category.label, "</span>");
    var attributeLable = "<span class=\"attribute\">".concat(isPrimaryKey ? keys.uniqueEntryId : mainCategory.label, "</span>"); // for continuous value (distribution), do not output label

    var subCategory = isPrimaryKey ? '' : Records$1.getValue(keys.mainCategoryId, keys.subCategoryId);
    var valueLabel = (attribute === null || attribute === void 0 ? void 0 : attribute.datamodel) !== 'distribution' && subCategory !== null && subCategory !== void 0 && subCategory.label ? "<span class=\"value\">".concat(subCategory.label, "</span>") : '';
    var header = document.createElement('header');
    header.innerHTML = "\n      <div class=\"label\">\n        ".concat(categoryLabel, "\n        ").concat(attributeLable, "\n        ").concat(valueLabel, "\n      </div>\n      <div/>\n    ");
    header.classList.add('_catexxxgory-background-color');
    header.lastElementChild.appendChild(_classPrivateFieldGet(this, _exit_button));
    header.addEventListener('mousedown', function (e) {
      var customEvent = new CustomEvent(dragElement, {
        detail: {
          x: e.clientX,
          y: e.clientY,
          container: header.parentElement,
          dragableElement: header
        }
      });
      DefaultEventEmitter$1.dispatchEvent(customEvent);
    });
    return header;
  }

  function _container2(keys, props) {
    var _this2 = this;

    var container = document.createElement('div');
    container.className = 'container';
    ['Up', 'Right', 'Down', 'Left'].forEach(function (direction) {
      container.appendChild(_classPrivateMethodGet(_this2, _arrow, _arrow2).call(_this2, direction, props));
    });
    container.appendChild(_classPrivateMethodGet(this, _stanzas, _stanzas2).call(this, keys.uniqueEntryId, keys.dataKey));
    return container;
  }

  function _stanzas2(uniqueEntryId, dataKey) {
    var stanzas = document.createElement('div');
    stanzas.className = 'stanzas';
    stanzas.innerHTML += StanzaManager$1.draw(dataKey, uniqueEntryId);
    stanzas.querySelectorAll('script').forEach(function (scriptElement) {
      var _script = document.createElement('script');

      _script.textContent = scriptElement.textContent;
      scriptElement.replaceWith(_script);
    });
    return stanzas;
  }

  function _arrow2(direction, props) {
    var _this3 = this;

    var arrow = document.createElement('div');
    arrow.classList.add('arrow', "-".concat(direction.toLowerCase()));
    arrow.addEventListener('click', function (e) {
      var arrowMovement = {
        dir: direction,
        curX: parseInt(props.dataX),
        curY: parseInt(props.dataY),
        curInternalIndex: parseInt(props.dataSubOrder),
        getTargetAxes: _classPrivateFieldGet(_this3, _arrowFuncs).get('Arrow' + direction)
      };

      _classPrivateMethodGet(_this3, _setMovementArrow, _setMovementArrow2).call(_this3, arrowMovement);
    });
    return arrow;
  }

  function _setHighlight2(x, y, subOrder) {
    var entry = _classPrivateMethodGet(this, _entriesByAxes, _entriesByAxes2).call(this, x, y, subOrder);

    var tr = entry.closest('tr');
    entry.classList.add('-selected');
    tr.classList.add('-selected');
    var customEvent = new CustomEvent(highlightCol, {
      detail: x
    });
    DefaultEventEmitter$1.dispatchEvent(customEvent);
  }

  function _setMovementArrow2(movement) {
    try {
      var targetEntry = _classPrivateMethodGet(this, _getTargetEntry, _getTargetEntry2).call(this, movement);

      targetEntry.scrollIntoView({
        block: 'center'
      });
      createPopupEvent(targetEntry, movePopup);
    } catch (error) {
      console.log('Movement out of bounds');
    }
  }

  function _getTargetEntry2(move) {
    // Check if there are multiple entries in the current cell when going up or down
    if (['Down', 'Up'].includes(move.dir)) {
      var allCurEntries = _classPrivateMethodGet(this, _entriesByAxes, _entriesByAxes2).call(this, move.curX, move.curY);

      var targetInternalIndex = move.getTargetAxes(move.curInternalIndex)[1]; // movement inside cell

      if (allCurEntries[targetInternalIndex]) {
        return allCurEntries[targetInternalIndex];
      }
    } // default: target outside of current cell


    var _move$getTargetAxes = move.getTargetAxes(move.curX, move.curY),
        _move$getTargetAxes2 = _slicedToArray(_move$getTargetAxes, 2),
        targetX = _move$getTargetAxes2[0],
        targetY = _move$getTargetAxes2[1];

    var allTargetEntries = _classPrivateMethodGet(this, _entriesByAxes, _entriesByAxes2).call(this, targetX, targetY);

    var targetIndex = move.dir === 'Up' ? allTargetEntries.length - 1 : 0;
    return allTargetEntries[targetIndex];
  }

  function _entriesByAxes2(x, y, subOrder) {
    if (subOrder === undefined) {
      return _classPrivateFieldGet(this, _RESULTS_TABLE).querySelectorAll("[data-order = '".concat(x, ",").concat(y, "']"));
    }

    return _classPrivateFieldGet(this, _RESULTS_TABLE).querySelector("[data-order = '".concat(x, ",").concat(y, "'][data-sub-order = '").concat(subOrder, "']"));
  }

  function _hidePopup2() {
    var exitingPopup = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    // reset popup to the center if it is shown for first time
    // keep moved axes if user has dragged popup while moving with arrows
    var popupStyle = _classPrivateFieldGet(this, _RESULT_MODAL).querySelector('.popup').style;

    _classPrivateFieldSet(this, _popup_top, exitingPopup ? '' : popupStyle.top);

    _classPrivateFieldSet(this, _popup_left, exitingPopup ? '' : popupStyle.left);

    _classPrivateFieldGet(this, _RESULT_MODAL).classList.remove('backdrop');

    _classPrivateFieldGet(this, _RESULT_MODAL).innerHTML = '';

    _classPrivateFieldGet(this, _RESULTS_TABLE).querySelectorAll('.-selected').forEach(function (entry) {
      return entry.classList.remove('-selected');
    });

    document.removeEventListener('keydown', _classPrivateFieldGet(this, _handleKeydown));
  }

  var _ROOT$4 = /*#__PURE__*/new WeakMap();

  var _CONTAINER = /*#__PURE__*/new WeakMap();

  var BalloonView = /*#__PURE__*/_createClass(function BalloonView() {
    var _this = this;

    _classCallCheck(this, BalloonView);

    _classPrivateFieldInitSpec(this, _ROOT$4, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _CONTAINER, {
      writable: true,
      value: void 0
    });

    // make element
    _classPrivateFieldSet(this, _ROOT$4, document.createElement('div'));

    _classPrivateFieldGet(this, _ROOT$4).className = 'balloon-view';
    document.querySelector('body').insertAdjacentElement('beforeend', _classPrivateFieldGet(this, _ROOT$4));
    _classPrivateFieldGet(this, _ROOT$4).innerHTML = '<div class="container"></div>';

    _classPrivateFieldSet(this, _CONTAINER, _classPrivateFieldGet(this, _ROOT$4).querySelector(':scope > .container')); // event listener


    DefaultEventEmitter$1.addEventListener(enterAttributeValueItemView, function (_ref) {
      var _ref$detail = _ref.detail,
          elm = _ref$detail.elm,
          label = _ref$detail.label,
          values = _ref$detail.values;
      _classPrivateFieldGet(_this, _CONTAINER).innerHTML = "\n        <header>".concat(label, "</header>\n        ").concat(values.map(function (value) {
        return "<dl>\n          <dt>".concat(value.key, ":</dt>\n          <dd>").concat(value.value, "</dd>\n        </dl>");
      }).join('')); // geography

      var rect = elm.getBoundingClientRect();
      var isBelow = window.innerHeight * .3 > rect.top;
      _classPrivateFieldGet(_this, _ROOT$4).style.left = rect.left + rect.width * .5 + 'px';

      if (isBelow) {
        _classPrivateFieldGet(_this, _ROOT$4).classList.add('-below');

        _classPrivateFieldGet(_this, _ROOT$4).style.top = rect.bottom + 'px';
      } else {
        _classPrivateFieldGet(_this, _ROOT$4).classList.remove('-below');

        _classPrivateFieldGet(_this, _ROOT$4).style.top = rect.top + 'px';
      }

      _classPrivateFieldGet(_this, _ROOT$4).classList.add('-showing');
    });
    DefaultEventEmitter$1.addEventListener(leaveAttributeValueItemView, function () {
      _classPrivateFieldGet(_this, _ROOT$4).classList.remove('-showing');
    });
  });

  /**
   * @enum { string } MODE
   */
  var MODE = {
    SIMPLE: 'simple',
    DETAILED: 'detailed'
  };

  var _ROOT$3 = /*#__PURE__*/new WeakMap();

  var _TEXT_OFFSET = /*#__PURE__*/new WeakMap();

  var _TEXT_TOTAL = /*#__PURE__*/new WeakMap();

  var _TEXT_STATUS = /*#__PURE__*/new WeakMap();

  var _BAR = /*#__PURE__*/new WeakMap();

  var _totalDuration = /*#__PURE__*/new WeakMap();

  var _total = /*#__PURE__*/new WeakMap();

  var _mode = /*#__PURE__*/new WeakMap();

  var _updateAmount = /*#__PURE__*/new WeakSet();

  var _updateBarWidth = /*#__PURE__*/new WeakSet();

  var _remainingTimeInSec = /*#__PURE__*/new WeakSet();

  var _timeString = /*#__PURE__*/new WeakSet();

  var _updateTime = /*#__PURE__*/new WeakSet();

  var _setMessage = /*#__PURE__*/new WeakSet();

  var ProgressIndicator = /*#__PURE__*/function () {
    /**
     * @param { HTMLElement } elm
     * @param { 'simple' | 'detailed' } mode - Default is detailed mode with time bar and amount tracker
     */
    function ProgressIndicator(elm) {
      var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MODE.DETAILED;

      _classCallCheck(this, ProgressIndicator);

      _classPrivateMethodInitSpec(this, _setMessage);

      _classPrivateMethodInitSpec(this, _updateTime);

      _classPrivateMethodInitSpec(this, _timeString);

      _classPrivateMethodInitSpec(this, _remainingTimeInSec);

      _classPrivateMethodInitSpec(this, _updateBarWidth);

      _classPrivateMethodInitSpec(this, _updateAmount);

      _classPrivateFieldInitSpec(this, _ROOT$3, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _TEXT_OFFSET, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _TEXT_TOTAL, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _TEXT_STATUS, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _BAR, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _totalDuration, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _total, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _mode, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(this, _mode, mode);

      elm.classList.add('progress-indicator', "-".concat(mode));
      var loadingIcon = mode === MODE.SIMPLE ? '<span class="material-icons-outlined -rotating">autorenew</span>' : '';
      var counter = mode === MODE.DETAILED ? "<div class=\"amount-of-data\">\n          <span class=\"offset\">0</span>\n          <span class=\"total\"></span>\n      </div>" : '';
      elm.innerHTML = " \n      <div class=\"text\">\n        ".concat(counter, "\n        <div class=\"status\">\n          ").concat(loadingIcon, "\n        </div>\n      </div>\n      <div class=\"progress\">\n        <div class=\"bar\"></div>\n      </div>");

      _classPrivateFieldSet(this, _ROOT$3, elm);

      _classPrivateFieldSet(this, _BAR, elm.querySelector(':scope > .progress > .bar'));

      _classPrivateFieldSet(this, _TEXT_STATUS, elm.querySelector(':scope > .text > .status'));

      _classPrivateFieldSet(this, _total, 0);

      if (mode === MODE.SIMPLE) return;

      _classPrivateFieldSet(this, _TEXT_OFFSET, elm.querySelector(':scope > .text > .amount-of-data > .offset'));

      _classPrivateFieldSet(this, _TEXT_TOTAL, elm.querySelector(':scope > .text > .amount-of-data > .total'));

      _classPrivateFieldSet(this, _totalDuration, 0);
    }
    /* private methods */

    /**
     * @param { number } offset
     */


    _createClass(ProgressIndicator, [{
      key: "updateProgressBar",
      value:
      /* public accessors */

      /**
       * @param { {offset: number, startTime: number} } progressInfo
       */
      function updateProgressBar(_ref) {
        var _ref$offset = _ref.offset,
            offset = _ref$offset === void 0 ? 0 : _ref$offset,
            startTime = _ref.startTime;

        _classPrivateMethodGet(this, _updateBarWidth, _updateBarWidth2).call(this, offset);

        if (_classPrivateFieldGet(this, _mode) === MODE.SIMPLE || !startTime) return;

        _classPrivateMethodGet(this, _updateAmount, _updateAmount2).call(this, offset);

        _classPrivateMethodGet(this, _updateTime, _updateTime2).call(this, offset, startTime);
      }
      /**
       * @param { string } message
       * @param { number } total
       * @param { boolean } isError
       */

    }, {
      key: "setIndicator",
      value: function setIndicator() {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var total = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var isError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        _classPrivateFieldSet(this, _total, total);

        if (_classPrivateFieldGet(this, _mode) === MODE.SIMPLE) _classPrivateMethodGet(this, _setMessage, _setMessage2).call(this, message, isError);else if (_classPrivateFieldGet(this, _mode) === MODE.DETAILED) _classPrivateFieldGet(this, _TEXT_TOTAL).textContent = "/ ".concat(_classPrivateFieldGet(this, _total).toString());
      }
    }, {
      key: "reset",
      value: function reset() {
        this.setIndicator();

        _classPrivateMethodGet(this, _updateBarWidth, _updateBarWidth2).call(this);
      }
    }]);

    return ProgressIndicator;
  }();

  function _updateAmount2(offset) {
    _classPrivateFieldGet(this, _TEXT_OFFSET).textContent = "".concat(offset.toString());
  }

  function _updateBarWidth2() {
    var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    _classPrivateFieldGet(this, _BAR).style.width = offset / _classPrivateFieldGet(this, _total) ? "".concat(offset / _classPrivateFieldGet(this, _total) * 100, "%") : '0%';
  }

  function _remainingTimeInSec2(durationPerItem, itemsLeft) {
    return durationPerItem * itemsLeft / 1000 || 0;
  }

  function _timeString2(time) {
    if (time <= 0) return '0 sec.';
    var h, m, s;
    h = Math.floor(time / 3600);
    m = Math.floor(time % 3600 / 60);
    s = Math.floor(time % 3600 % 60);
    return h > 0 ? "".concat(h, " hr.") : m > 0 ? "".concat(m, " min.") : "".concat(s, " sec.");
  }

  function _updateTime2(offset, startTime) {
    _classPrivateFieldSet(this, _totalDuration, _classPrivateFieldGet(this, _totalDuration) + (Date.now() - startTime));

    var remainingTime = _classPrivateMethodGet(this, _remainingTimeInSec, _remainingTimeInSec2).call(this, _classPrivateFieldGet(this, _totalDuration) / offset, _classPrivateFieldGet(this, _total) - offset);

    _classPrivateFieldGet(this, _TEXT_STATUS).innerHTML = _classPrivateMethodGet(this, _timeString, _timeString2).call(this, remainingTime);
  }

  function _setMessage2(message, isError) {
    _classPrivateFieldGet(this, _TEXT_STATUS).childNodes[0].nodeValue = message;
    isError ? _classPrivateFieldGet(this, _ROOT$3).classList.add('error') : _classPrivateFieldGet(this, _ROOT$3).classList.remove('error');
  }

  var LIMIT = 10;
  var downloadUrls = new Map();
  var timeOutError$1 = 'ECONNABORTED';
  /**
   * @typedef { Object } Mode
   * @property { string } label
   * @property { string } icon
   * @property { string } dataButton
   */

  var dataButtonModes = new Map([['edit', {
    label: 'Edit',
    icon: 'edit',
    dataButton: 'edit'
  }], ['resume', {
    label: 'Resume',
    icon: 'play_arrow',
    dataButton: 'resume'
  }], ['pause', {
    label: 'Pause',
    icon: 'pause',
    dataButton: 'pause'
  }], ['tsv', {
    label: 'TSV',
    icon: 'download',
    dataButton: 'download-tsv'
  }], ['json', {
    label: 'JSON',
    icon: 'download',
    dataButton: 'download-json'
  }], ['retry', {
    label: 'Retry',
    icon: 'refresh',
    dataButton: 'retry'
  }], ['empty', {
    label: '',
    icon: '',
    dataButton: ''
  }]]);

  var _dxCondition = /*#__PURE__*/new WeakMap();

  var _queryIds = /*#__PURE__*/new WeakMap();

  var _rows = /*#__PURE__*/new WeakMap();

  var _source$1 = /*#__PURE__*/new WeakMap();

  var _isLoading = /*#__PURE__*/new WeakMap();

  var _isCompleted = /*#__PURE__*/new WeakMap();

  var _ROOT$2 = /*#__PURE__*/new WeakMap();

  var _STATUS = /*#__PURE__*/new WeakMap();

  var _progressIndicator$1 = /*#__PURE__*/new WeakMap();

  var _CONTROLLER = /*#__PURE__*/new WeakMap();

  var _BUTTON_LEFT = /*#__PURE__*/new WeakMap();

  var _BUTTON_RIGHT = /*#__PURE__*/new WeakMap();

  var _deleteCondition = /*#__PURE__*/new WeakSet();

  var _makeDataButton = /*#__PURE__*/new WeakSet();

  var _updateDataButton = /*#__PURE__*/new WeakSet();

  var _dataButtonPauseOrResume = /*#__PURE__*/new WeakSet();

  var _dataButtonEdit = /*#__PURE__*/new WeakSet();

  var _dataButtonRetry = /*#__PURE__*/new WeakSet();

  var _dataButtonEvent = /*#__PURE__*/new WeakSet();

  var _setDownloadButtons = /*#__PURE__*/new WeakSet();

  var _setJsonUrl = /*#__PURE__*/new WeakSet();

  var _setTsvUrl = /*#__PURE__*/new WeakSet();

  var _handleError = /*#__PURE__*/new WeakSet();

  var _displayError = /*#__PURE__*/new WeakSet();

  var _getQueryIds = /*#__PURE__*/new WeakSet();

  var _getProperties = /*#__PURE__*/new WeakSet();

  var _complete$1 = /*#__PURE__*/new WeakSet();

  var TableData = /*#__PURE__*/function () {
    function TableData(dxCondition, elm) {
      var _this = this;

      _classCallCheck(this, TableData);

      _classPrivateMethodInitSpec(this, _complete$1);

      _classPrivateMethodInitSpec(this, _getProperties);

      _classPrivateMethodInitSpec(this, _getQueryIds);

      _classPrivateMethodInitSpec(this, _displayError);

      _classPrivateMethodInitSpec(this, _handleError);

      _classPrivateMethodInitSpec(this, _setTsvUrl);

      _classPrivateMethodInitSpec(this, _setJsonUrl);

      _classPrivateMethodInitSpec(this, _setDownloadButtons);

      _classPrivateMethodInitSpec(this, _dataButtonEvent);

      _classPrivateMethodInitSpec(this, _dataButtonRetry);

      _classPrivateMethodInitSpec(this, _dataButtonEdit);

      _classPrivateMethodInitSpec(this, _dataButtonPauseOrResume);

      _classPrivateMethodInitSpec(this, _updateDataButton);

      _classPrivateMethodInitSpec(this, _makeDataButton);

      _classPrivateMethodInitSpec(this, _deleteCondition);

      _classPrivateFieldInitSpec(this, _dxCondition, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _queryIds, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _rows, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _source$1, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _isLoading, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _isCompleted, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _ROOT$2, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _STATUS, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _progressIndicator$1, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _CONTROLLER, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _BUTTON_LEFT, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _BUTTON_RIGHT, {
        writable: true,
        value: void 0
      });

      var cancelToken = axios.CancelToken;

      _classPrivateFieldSet(this, _source$1, cancelToken.source());

      _classPrivateFieldSet(this, _isLoading, false);

      _classPrivateFieldSet(this, _isCompleted, false);

      _classPrivateFieldSet(this, _dxCondition, dxCondition);

      _classPrivateFieldSet(this, _queryIds, []);

      _classPrivateFieldSet(this, _rows, []); // view


      elm.classList.add('table-data-controller-view');
      elm.dataset.status = 'load ids';
      elm.innerHTML = "\n    <div class=\"close-button-view\"></div>\n    <div class=\"conditions\">\n      <div class=\"condition\">\n        <p title=\"".concat(dxCondition.togoKey, "\">").concat(Records$1.getDatasetLabel(dxCondition.togoKey), "</p>\n      </div>\n      ").concat(_classPrivateFieldGet(this, _dxCondition).valuesConditions.map(function (valuesCondition) {
        var label = Records$1.getAttribute(valuesCondition.attributeId).label;
        return "<div class=\"condition _catexxxgory-background-color\" data-catexxxgory-id=\"".concat(valuesCondition.catexxxgoryId, "\">\n              <p title=\"").concat(label, "\">").concat(label, "</p>\n            </div>");
      }).join(''), "\n      ").concat(_classPrivateFieldGet(this, _dxCondition).keyConditions.map(function (keyCondition) {
        return "<div class=\"condition _catexxxgory-color\" data-catexxxgory-id=\"".concat(keyCondition.catexxxgoryId, "\">\n              <p title=\"").concat(keyCondition.label, "\">").concat(keyCondition.label, "</p>\n            </div>");
      }).join(''), "\n    </div>\n    <div class=\"status\">\n      <p>Getting ID list</p>\n      <span class=\"material-icons-outlined -rotating\">autorenew</span>\n    </div>\n    <div class=\"-border\">\n    </div>\n    <div class=\"controller\">\n    </div>\n    "); // reference

      _classPrivateFieldSet(this, _ROOT$2, elm);

      _classPrivateFieldSet(this, _STATUS, elm.querySelector(':scope > .status > p'));

      _classPrivateFieldSet(this, _progressIndicator$1, new ProgressIndicator(elm.querySelector(':scope > .status + div')));

      _classPrivateFieldSet(this, _CONTROLLER, elm.querySelector(':scope > .controller'));

      _classPrivateFieldGet(this, _CONTROLLER).appendChild(_classPrivateMethodGet(this, _makeDataButton, _makeDataButton2).call(this, 'left'));

      _classPrivateFieldGet(this, _CONTROLLER).appendChild(_classPrivateMethodGet(this, _makeDataButton, _makeDataButton2).call(this, 'right', dataButtonModes.get('edit')));

      _classPrivateFieldSet(this, _BUTTON_LEFT, elm.querySelector(':scope > .controller > .button.left'));

      _classPrivateFieldSet(this, _BUTTON_RIGHT, elm.querySelector(':scope > .controller > .button.right')); // events


      elm.addEventListener('click', function () {
        if (elm.classList.contains('-current')) return;

        _this.select();
      }); // delete

      _classPrivateFieldGet(this, _ROOT$2).querySelector(':scope > .close-button-view').addEventListener('click', function (e) {
        _classPrivateMethodGet(_this, _deleteCondition, _deleteCondition2).call(_this, e);
      });

      ConditionBuilder$1.finish();
      this.select();

      _classPrivateFieldGet(this, _ROOT$2).classList.toggle('-fetching');

      _classPrivateMethodGet(this, _getQueryIds, _getQueryIds2).call(this);
    }
    /* private methods */


    _createClass(TableData, [{
      key: "select",
      value:
      /* public methods */
      function select() {
        _classPrivateFieldGet(this, _ROOT$2).classList.add('-current'); // dispatch event


        var customEvent1 = new CustomEvent(selectTableData, {
          detail: this
        });
        DefaultEventEmitter$1.dispatchEvent(customEvent1); // send rows

        if (_classPrivateFieldGet(this, _ROOT$2).dataset.status !== 'load ids') {
          var done = this.offset >= _classPrivateFieldGet(this, _queryIds).length;

          var customEvent2 = new CustomEvent(addNextRows, {
            detail: {
              tableData: this,
              rows: _classPrivateFieldGet(this, _rows),
              done: done
            }
          });
          DefaultEventEmitter$1.dispatchEvent(customEvent2);
        }
      }
    }, {
      key: "deselect",
      value: function deselect() {
        _classPrivateFieldGet(this, _ROOT$2).classList.remove('-current');
      }
    }, {
      key: "next",
      value: function next() {
        if (_classPrivateFieldGet(this, _isLoading)) return;

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
        return _classPrivateFieldGet(this, _dxCondition).togoKey;
      }
    }, {
      key: "dxCondition",
      get: function get() {
        return _classPrivateFieldGet(this, _dxCondition);
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

  function _deleteCondition2(e) {
    e.stopPropagation();
    var customEvent = new CustomEvent(deleteTableData, {
      detail: this
    });
    DefaultEventEmitter$1.dispatchEvent(customEvent); // abort fetch

    _classPrivateFieldGet(this, _source$1).cancel('user cancel'); // delete element


    _classPrivateFieldGet(this, _ROOT$2).parentNode.removeChild(_classPrivateFieldGet(this, _ROOT$2)); // transition


    document.querySelector('body').dataset.display = 'properties';
  }

  function _makeDataButton2(className) {
    var _this2 = this;

    var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var button = document.createElement('div');
    button.innerHTML = "\n      <a>\n        <span class=\"material-icons-outlined\"></span>\n        <span class=\"label\"></span>\n      </a>";
    button.classList.add('button', className);
    if (mode) _classPrivateMethodGet(this, _updateDataButton, _updateDataButton2).call(this, button, mode);
    button.addEventListener('click', function (e) {
      _classPrivateMethodGet(_this2, _dataButtonEvent, _dataButtonEvent2).call(_this2, e);
    });
    return button;
  }

  function _updateDataButton2(target, mode, urlType) {
    target.dataset.button = mode.dataButton;
    var anchor = target.querySelector(':scope > a');
    anchor.querySelector(':scope > .material-icons-outlined').innerText = mode.icon;
    anchor.querySelector(':scope > .label').innerText = mode.label;

    if (urlType) {
      var url = downloadUrls.get(urlType);
      anchor.setAttribute('href', url);
      var timeStamp = new Date();
      var _ref = [timeStamp.toISOString().slice(0, 10).replaceAll('-', ''), timeStamp.toLocaleTimeString().replaceAll(':', '')],
          date = _ref[0],
          time = _ref[1];
      anchor.setAttribute('download', "togodx-".concat(date, "-").concat(time, ".").concat(urlType));
    }
  }

  function _dataButtonPauseOrResume2(e) {
    e.stopPropagation();

    _classPrivateFieldGet(this, _ROOT$2).classList.toggle('-fetching');

    _classPrivateFieldGet(this, _STATUS).classList.toggle('-flickering');

    var modeToChangeTo = _classPrivateFieldGet(this, _isLoading) ? 'resume' : 'pause';

    _classPrivateMethodGet(this, _updateDataButton, _updateDataButton2).call(this, e.currentTarget, dataButtonModes.get(modeToChangeTo));

    _classPrivateFieldSet(this, _isLoading, !_classPrivateFieldGet(this, _isLoading));

    _classPrivateFieldGet(this, _STATUS).textContent = _classPrivateFieldGet(this, _isLoading) ? 'Getting data' : 'Awaiting';
    if (_classPrivateFieldGet(this, _isLoading)) _classPrivateMethodGet(this, _getProperties, _getProperties2).call(this);
  }

  function _dataButtonEdit2(e) {
    var _this3 = this;

    e.stopPropagation(); // property (attribute)

    ConditionBuilder$1.setAttributes(_classPrivateFieldGet(this, _dxCondition).keyConditions.map(function (keyCondition) {
      return {
        attributeId: keyCondition.attributeId,
        parentCategoryId: keyCondition.parentCategoryId
      };
    }), false); // attribute (classification/distribution)

    Records$1.attributes.forEach(function (_ref2) {
      var id = _ref2.id;

      var valuesCondition = _classPrivateFieldGet(_this3, _dxCondition).valuesConditions.find(function (valuesCondition) {
        return valuesCondition.attributeId === id;
      });

      var categoryIds = [];
      if (valuesCondition) categoryIds.push.apply(categoryIds, _toConsumableArray(valuesCondition.categoryIds));
      ConditionBuilder$1.setAttributeValues(id, categoryIds, false);
    });
  }

  function _dataButtonRetry2() {
    _classPrivateFieldGet(this, _STATUS).classList.remove('-error');

    _classPrivateFieldGet(this, _ROOT$2).classList.toggle('-fetching');

    _classPrivateMethodGet(this, _updateDataButton, _updateDataButton2).call(this, _classPrivateFieldGet(this, _BUTTON_LEFT), dataButtonModes.get('empty'));

    var partiallyLoaded = _classPrivateFieldGet(this, _queryIds).length > 0;
    var message = partiallyLoaded ? 'Getting data' : 'Getting ID list';
    _classPrivateFieldGet(this, _STATUS).textContent = message;
    if (partiallyLoaded) _classPrivateMethodGet(this, _getProperties, _getProperties2).call(this);else _classPrivateMethodGet(this, _getQueryIds, _getQueryIds2).call(this);
  }

  function _dataButtonEvent2(e) {
    var button = e.currentTarget;
    var mode = button.dataset.button;

    switch (mode) {
      case 'edit':
        _classPrivateMethodGet(this, _dataButtonEdit, _dataButtonEdit2).call(this, e);

        break;

      case 'resume':
      case 'pause':
        _classPrivateMethodGet(this, _dataButtonPauseOrResume, _dataButtonPauseOrResume2).call(this, e);

        break;

      case 'retry':
        _classPrivateMethodGet(this, _dataButtonRetry, _dataButtonRetry2).call(this);

        break;
    }
  }

  function _setDownloadButtons2() {
    _classPrivateMethodGet(this, _setTsvUrl, _setTsvUrl2).call(this);

    _classPrivateMethodGet(this, _updateDataButton, _updateDataButton2).call(this, _classPrivateFieldGet(this, _BUTTON_LEFT), dataButtonModes.get('tsv'), 'tsv');

    _classPrivateMethodGet(this, _setJsonUrl, _setJsonUrl2).call(this);

    var middleButton = _classPrivateMethodGet(this, _makeDataButton, _makeDataButton2).call(this, 'middle', 'json');

    _classPrivateMethodGet(this, _updateDataButton, _updateDataButton2).call(this, middleButton, dataButtonModes.get('json'), 'json');

    _classPrivateFieldGet(this, _CONTROLLER).insertBefore(middleButton, _classPrivateFieldGet(this, _BUTTON_RIGHT));
  }

  function _setJsonUrl2() {
    var jsonBlob = new Blob([JSON.stringify(_classPrivateFieldGet(this, _rows), null, 2)], {
      type: 'application/json'
    });
    downloadUrls.set('json', URL.createObjectURL(jsonBlob));
  }

  function _setTsvUrl2() {
    var _this4 = this;

    var temporaryArray = [];

    _classPrivateFieldGet(this, _rows).forEach(function (row) {
      row.properties.forEach(function (property) {
        property.attributes.forEach(function (attribute) {
          var singleItem = [_classPrivateFieldGet(_this4, _dxCondition).togoKey, // togoKey
          row.id, // togoKeyId
          row.label, // togoKeyLabel
          property.propertyId, // attribute
          property.propertyKey, // attributeKey
          attribute.id, // attributeKeyId
          attribute.attribute.label // attributeValue
          ];
          temporaryArray.push(singleItem);
        });
      });
    });

    var tsvArray = temporaryArray.map(function (item) {
      return item.join('\t');
    });

    if (tsvArray.length !== 0) {
      var tsvHeader = ['togoKey', 'togoKeyId', 'togoKeyLabel', 'attribute', 'attributeKey', 'attributeKeyId', 'attributeValue'];
      tsvArray.unshift(tsvHeader.join('\t'));
    }

    var bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    var tsvBlob = new Blob([bom, tsvArray.join('\n')], {
      type: 'text/plain'
    });
    var tsvUrl = URL.createObjectURL(tsvBlob);
    downloadUrls.set('tsv', tsvUrl);
  }

  function _handleError2(err) {
    var _err$response, _err$response2, _err$response3;

    if (axios.isCancel && err.message === 'user cancel') return;
    var code = (_err$response = err.response) === null || _err$response === void 0 ? void 0 : _err$response.status;
    var message = ((_err$response2 = err.response) === null || _err$response2 === void 0 ? void 0 : _err$response2.statusText) || err.message;

    _classPrivateMethodGet(this, _displayError, _displayError2).call(this, message, code);

    if (((_err$response3 = err.response) === null || _err$response3 === void 0 ? void 0 : _err$response3.status) === 500 | err.code === timeOutError$1) {
      _classPrivateMethodGet(this, _updateDataButton, _updateDataButton2).call(this, _classPrivateFieldGet(this, _BUTTON_LEFT), dataButtonModes.get('retry'));

      return;
    }

    _classPrivateFieldGet(this, _BUTTON_LEFT).remove();
  }

  function _displayError2(message, code) {
    _classPrivateFieldGet(this, _STATUS).classList.add('-error');

    _classPrivateFieldGet(this, _STATUS).textContent = code ? "".concat(message, " (").concat(code, ")") : message;

    _classPrivateFieldGet(this, _ROOT$2).classList.toggle('-fetching');

    var customEvent = new CustomEvent(failedFetchTableDataIds, {
      detail: this
    });
    DefaultEventEmitter$1.dispatchEvent(customEvent);
  }

  function _getQueryIds2() {
    var _this5 = this;

    axios.post(App$1.getApiUrl('aggregate'), getApiParameter('aggregate', {
      dataset: _classPrivateFieldGet(this, _dxCondition).togoKey,
      filters: _classPrivateFieldGet(this, _dxCondition).queryFilters,
      queries: ConditionBuilder$1.userIds
    }), {
      cancelToken: _classPrivateFieldGet(this, _source$1).token
    }).then(function (response) {
      _classPrivateFieldSet(_this5, _queryIds, response.data);

      if (_classPrivateFieldGet(_this5, _queryIds).length <= 0) {
        _classPrivateMethodGet(_this5, _complete$1, _complete2$1).call(_this5, false);

        return;
      }

      _classPrivateFieldGet(_this5, _ROOT$2).dataset.status = 'load rows';
      _classPrivateFieldGet(_this5, _STATUS).textContent = 'Getting data';

      _classPrivateFieldGet(_this5, _progressIndicator$1).setIndicator(undefined, _classPrivateFieldGet(_this5, _queryIds).length);

      _classPrivateMethodGet(_this5, _updateDataButton, _updateDataButton2).call(_this5, _classPrivateFieldGet(_this5, _BUTTON_LEFT), dataButtonModes.get('pause'));

      _classPrivateMethodGet(_this5, _getProperties, _getProperties2).call(_this5);
    }).catch(function (error) {
      _classPrivateMethodGet(_this5, _handleError, _handleError2).call(_this5, error);
    });
  }

  function _getProperties2() {
    var _this6 = this;

    _classPrivateFieldSet(this, _isLoading, true);

    var startTime = Date.now();
    axios.post(App$1.getApiUrl('dataframe'), getApiParameter('dataframe', {
      dataset: _classPrivateFieldGet(this, _dxCondition).togoKey,
      filters: _classPrivateFieldGet(this, _dxCondition).queryFilters,
      annotations: _classPrivateFieldGet(this, _dxCondition).queryAnnotations,
      queries: _classPrivateFieldGet(this, _queryIds).slice(this.offset, this.offset + LIMIT)
    }), {
      cancelToken: _classPrivateFieldGet(this, _source$1).token
    }).then(function (response) {
      var _classPrivateFieldGet2;

      var offset = _this6.offset;

      (_classPrivateFieldGet2 = _classPrivateFieldGet(_this6, _rows)).push.apply(_classPrivateFieldGet2, _toConsumableArray(response.data));

      _classPrivateFieldSet(_this6, _isCompleted, _this6.offset >= _classPrivateFieldGet(_this6, _queryIds).length);

      _classPrivateFieldGet(_this6, _progressIndicator$1).updateProgressBar({
        offset: _this6.offset,
        startTime: startTime
      }); // dispatch event


      var customEvent2 = new CustomEvent(addNextRows, {
        detail: {
          tableData: _this6,
          offset: offset,
          rows: response.data,
          done: _classPrivateFieldGet(_this6, _isCompleted)
        }
      });
      DefaultEventEmitter$1.dispatchEvent(customEvent2); // turn off after finished

      if (_classPrivateFieldGet(_this6, _isCompleted)) {
        _classPrivateMethodGet(_this6, _complete$1, _complete2$1).call(_this6);

        return;
      }

      if (_classPrivateFieldGet(_this6, _isLoading)) _classPrivateMethodGet(_this6, _getProperties, _getProperties2).call(_this6);
    }).catch(function (error) {
      _classPrivateMethodGet(_this6, _handleError, _handleError2).call(_this6, error);
    });
  }

  function _complete2$1() {
    var withData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    _classPrivateFieldGet(this, _ROOT$2).dataset.status = 'complete';
    _classPrivateFieldGet(this, _STATUS).textContent = withData ? 'Complete' : 'No Data Found';

    _classPrivateFieldGet(this, _ROOT$2).classList.remove('-fetching');

    _classPrivateFieldGet(this, _STATUS).classList.remove('-flickering');

    if (withData) _classPrivateMethodGet(this, _setDownloadButtons, _setDownloadButtons2).call(this);
  }

  var _tableData = /*#__PURE__*/new WeakMap();

  var _ROOT$1 = /*#__PURE__*/new WeakMap();

  var _CONDITIONS_CONTAINER = /*#__PURE__*/new WeakMap();

  var _setTableData = /*#__PURE__*/new WeakSet();

  var _selectTableData = /*#__PURE__*/new WeakSet();

  var _deleteTableData = /*#__PURE__*/new WeakSet();

  var ConditionsController = /*#__PURE__*/_createClass(function ConditionsController(_elm) {
    var _this = this;

    _classCallCheck(this, ConditionsController);

    _classPrivateMethodInitSpec(this, _deleteTableData);

    _classPrivateMethodInitSpec(this, _selectTableData);

    _classPrivateMethodInitSpec(this, _setTableData);

    _classPrivateFieldInitSpec(this, _tableData, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _ROOT$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _CONDITIONS_CONTAINER, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _tableData, []); // references


    _classPrivateFieldSet(this, _ROOT$1, _elm);

    _classPrivateFieldSet(this, _CONDITIONS_CONTAINER, _elm.querySelector(':scope > .conditions')); // event listener


    DefaultEventEmitter$1.addEventListener(completeQueryParameter, function (e) {
      return _classPrivateMethodGet(_this, _setTableData, _setTableData2).call(_this, e.detail);
    });
    DefaultEventEmitter$1.addEventListener(selectTableData, function (e) {
      return _classPrivateMethodGet(_this, _selectTableData, _selectTableData2).call(_this, e.detail);
    });
    DefaultEventEmitter$1.addEventListener(deleteTableData, function (e) {
      return _classPrivateMethodGet(_this, _deleteTableData, _deleteTableData2).call(_this, e.detail);
    }); // observe number of conditions

    var config = {
      attributes: false,
      childList: true,
      subtree: false
    };

    var callback = function callback(mutationsList, observer) {
      _classPrivateFieldGet(_this, _ROOT$1).dataset.numberOfConditions = _classPrivateFieldGet(_this, _CONDITIONS_CONTAINER).childNodes.length;
    };

    var observer = new MutationObserver(callback);
    observer.observe(_classPrivateFieldGet(this, _CONDITIONS_CONTAINER), config);
  }
  /* private methods */

  /**
   * 
   * @param {DXCondition} dxCondition 
   */
  );

  function _setTableData2(dxCondition) {
    // find matching condition from already existing conditions
    var sameConditionTableData = _classPrivateFieldGet(this, _tableData).find(function (tableData) {
      return tableData.dxCondition.checkSameCondition(dxCondition);
    });

    if (sameConditionTableData) {
      // use existing table data
      sameConditionTableData.select();
    } else {
      // make new table data
      var elm = document.createElement('div');

      _classPrivateFieldGet(this, _CONDITIONS_CONTAINER).insertAdjacentElement('afterbegin', elm);

      _classPrivateFieldGet(this, _tableData).push(new TableData(dxCondition, elm));
    }
  }

  function _selectTableData2(selectedTableData) {
    document.body.dataset.display = 'results'; // deselect

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

  function _deleteTableData2(tableData) {
    var index = _classPrivateFieldGet(this, _tableData).indexOf(tableData);

    _classPrivateFieldGet(this, _tableData).splice(index, 1);
  }

  const denyList = new Set([
  	'ENOTFOUND',
  	'ENETUNREACH',

  	// SSL errors from https://github.com/nodejs/node/blob/fc8e3e2cdc521978351de257030db0076d79e0ab/src/crypto/crypto_common.cc#L301-L328
  	'UNABLE_TO_GET_ISSUER_CERT',
  	'UNABLE_TO_GET_CRL',
  	'UNABLE_TO_DECRYPT_CERT_SIGNATURE',
  	'UNABLE_TO_DECRYPT_CRL_SIGNATURE',
  	'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY',
  	'CERT_SIGNATURE_FAILURE',
  	'CRL_SIGNATURE_FAILURE',
  	'CERT_NOT_YET_VALID',
  	'CERT_HAS_EXPIRED',
  	'CRL_NOT_YET_VALID',
  	'CRL_HAS_EXPIRED',
  	'ERROR_IN_CERT_NOT_BEFORE_FIELD',
  	'ERROR_IN_CERT_NOT_AFTER_FIELD',
  	'ERROR_IN_CRL_LAST_UPDATE_FIELD',
  	'ERROR_IN_CRL_NEXT_UPDATE_FIELD',
  	'OUT_OF_MEM',
  	'DEPTH_ZERO_SELF_SIGNED_CERT',
  	'SELF_SIGNED_CERT_IN_CHAIN',
  	'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
  	'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  	'CERT_CHAIN_TOO_LONG',
  	'CERT_REVOKED',
  	'INVALID_CA',
  	'PATH_LENGTH_EXCEEDED',
  	'INVALID_PURPOSE',
  	'CERT_UNTRUSTED',
  	'CERT_REJECTED',
  	'HOSTNAME_MISMATCH'
  ]);

  // TODO: Use `error?.code` when targeting Node.js 14
  var isRetryAllowed = error => !denyList.has(error && error.code);

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  var namespace = 'axios-retry';
  /**
   * @param  {Error}  error
   * @return {boolean}
   */

  function isNetworkError(error) {
    return !error.response && Boolean(error.code) && // Prevents retrying cancelled requests
    error.code !== 'ECONNABORTED' && // Prevents retrying timed out requests
    isRetryAllowed(error); // Prevents retrying unsafe errors
  }
  var SAFE_HTTP_METHODS = ['get', 'head', 'options'];
  var IDEMPOTENT_HTTP_METHODS = SAFE_HTTP_METHODS.concat(['put', 'delete']);
  /**
   * @param  {Error}  error
   * @return {boolean}
   */

  function isRetryableError(error) {
    return error.code !== 'ECONNABORTED' && (!error.response || error.response.status >= 500 && error.response.status <= 599);
  }
  /**
   * @param  {Error}  error
   * @return {boolean}
   */

  function isSafeRequestError(error) {
    if (!error.config) {
      // Cannot determine if the request can be retried
      return false;
    }

    return isRetryableError(error) && SAFE_HTTP_METHODS.indexOf(error.config.method) !== -1;
  }
  /**
   * @param  {Error}  error
   * @return {boolean}
   */

  function isIdempotentRequestError(error) {
    if (!error.config) {
      // Cannot determine if the request can be retried
      return false;
    }

    return isRetryableError(error) && IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method) !== -1;
  }
  /**
   * @param  {Error}  error
   * @return {boolean | Promise}
   */

  function isNetworkOrIdempotentRequestError(error) {
    return isNetworkError(error) || isIdempotentRequestError(error);
  }
  /**
   * @return {number} - delay in milliseconds, always 0
   */

  function noDelay() {
    return 0;
  }
  /**
   * @param  {number} [retryNumber=0]
   * @return {number} - delay in milliseconds
   */


  function exponentialDelay() {
    var retryNumber = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var delay = Math.pow(2, retryNumber) * 100;
    var randomSum = delay * 0.2 * Math.random(); // 0-20% of the delay

    return delay + randomSum;
  }
  /**
   * Initializes and returns the retry state for the given request/config
   * @param  {AxiosRequestConfig} config
   * @return {Object}
   */

  function getCurrentState(config) {
    var currentState = config[namespace] || {};
    currentState.retryCount = currentState.retryCount || 0;
    config[namespace] = currentState;
    return currentState;
  }
  /**
   * Returns the axios-retry options for the current request
   * @param  {AxiosRequestConfig} config
   * @param  {AxiosRetryConfig} defaultOptions
   * @return {AxiosRetryConfig}
   */


  function getRequestOptions(config, defaultOptions) {
    return _objectSpread(_objectSpread({}, defaultOptions), config[namespace]);
  }
  /**
   * @param  {Axios} axios
   * @param  {AxiosRequestConfig} config
   */


  function fixConfig(axios, config) {
    if (axios.defaults.agent === config.agent) {
      delete config.agent;
    }

    if (axios.defaults.httpAgent === config.httpAgent) {
      delete config.httpAgent;
    }

    if (axios.defaults.httpsAgent === config.httpsAgent) {
      delete config.httpsAgent;
    }
  }
  /**
   * Checks retryCondition if request can be retried. Handles it's retruning value or Promise.
   * @param  {number} retries
   * @param  {Function} retryCondition
   * @param  {Object} currentState
   * @param  {Error} error
   * @return {boolean}
   */


  function shouldRetry(_x, _x2, _x3, _x4) {
    return _shouldRetry.apply(this, arguments);
  }
  /**
   * Adds response interceptors to an axios instance to retry requests failed due to network issues
   *
   * @example
   *
   * import axios from 'axios';
   *
   * axiosRetry(axios, { retries: 3 });
   *
   * axios.get('http://example.com/test') // The first request fails and the second returns 'ok'
   *   .then(result => {
   *     result.data; // 'ok'
   *   });
   *
   * // Exponential back-off retry delay between requests
   * axiosRetry(axios, { retryDelay : axiosRetry.exponentialDelay});
   *
   * // Custom retry delay
   * axiosRetry(axios, { retryDelay : (retryCount) => {
   *   return retryCount * 1000;
   * }});
   *
   * // Also works with custom axios instances
   * const client = axios.create({ baseURL: 'http://example.com' });
   * axiosRetry(client, { retries: 3 });
   *
   * client.get('/test') // The first request fails and the second returns 'ok'
   *   .then(result => {
   *     result.data; // 'ok'
   *   });
   *
   * // Allows request-specific configuration
   * client
   *   .get('/test', {
   *     'axios-retry': {
   *       retries: 0
   *     }
   *   })
   *   .catch(error => { // The first request fails
   *     error !== undefined
   *   });
   *
   * @param {Axios} axios An axios instance (the axios object or one created from axios.create)
   * @param {Object} [defaultOptions]
   * @param {number} [defaultOptions.retries=3] Number of retries
   * @param {boolean} [defaultOptions.shouldResetTimeout=false]
   *        Defines if the timeout should be reset between retries
   * @param {Function} [defaultOptions.retryCondition=isNetworkOrIdempotentRequestError]
   *        A function to determine if the error can be retried
   * @param {Function} [defaultOptions.retryDelay=noDelay]
   *        A function to determine the delay between retry requests
   */


  function _shouldRetry() {
    _shouldRetry = _asyncToGenerator(function* (retries, retryCondition, currentState, error) {
      var shouldRetryOrPromise = currentState.retryCount < retries && retryCondition(error); // This could be a promise

      if (typeof shouldRetryOrPromise === 'object') {
        try {
          yield shouldRetryOrPromise;
          return true;
        } catch (_err) {
          return false;
        }
      }

      return shouldRetryOrPromise;
    });
    return _shouldRetry.apply(this, arguments);
  }

  function axiosRetry(axios, defaultOptions) {
    axios.interceptors.request.use(config => {
      var currentState = getCurrentState(config);
      currentState.lastRequestTime = Date.now();
      return config;
    });
    axios.interceptors.response.use(null, /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* (error) {
        var {
          config
        } = error; // If we have no information to retry the request

        if (!config) {
          return Promise.reject(error);
        }

        var {
          retries = 3,
          retryCondition = isNetworkOrIdempotentRequestError,
          retryDelay = noDelay,
          shouldResetTimeout = false
        } = getRequestOptions(config, defaultOptions);
        var currentState = getCurrentState(config);

        if (yield shouldRetry(retries, retryCondition, currentState, error)) {
          currentState.retryCount += 1;
          var delay = retryDelay(currentState.retryCount, error); // Axios fails merging this configuration to the default configuration because it has an issue
          // with circular structures: https://github.com/mzabriskie/axios/issues/370

          fixConfig(axios, config);

          if (!shouldResetTimeout && config.timeout && currentState.lastRequestTime) {
            var lastRequestDuration = Date.now() - currentState.lastRequestTime; // Minimum 1ms timeout (passing 0 or less to XHR means no timeout)

            config.timeout = Math.max(config.timeout - lastRequestDuration - delay, 1);
          }

          config.transformRequest = [data => data];
          return new Promise(resolve => setTimeout(() => resolve(axios(config)), delay));
        }

        return Promise.reject(error);
      });

      return function (_x5) {
        return _ref.apply(this, arguments);
      };
    }());
  } // Compatibility with CommonJS

  axiosRetry.isNetworkError = isNetworkError;
  axiosRetry.isSafeRequestError = isSafeRequestError;
  axiosRetry.isIdempotentRequestError = isIdempotentRequestError;
  axiosRetry.isNetworkOrIdempotentRequestError = isNetworkOrIdempotentRequestError;
  axiosRetry.exponentialDelay = exponentialDelay;
  axiosRetry.isRetryableError = isRetryableError;

  var timeOutError = 'ECONNABORTED';

  var _ROOT = /*#__PURE__*/new WeakMap();

  var _BODY = /*#__PURE__*/new WeakMap();

  var _USER_IDS = /*#__PURE__*/new WeakMap();

  var _progressIndicator = /*#__PURE__*/new WeakMap();

  var _source = /*#__PURE__*/new WeakMap();

  var _offset = /*#__PURE__*/new WeakMap();

  var _errorCount = /*#__PURE__*/new WeakMap();

  var _fetch = /*#__PURE__*/new WeakSet();

  var _prepareProgressIndicator = /*#__PURE__*/new WeakSet();

  var _getAttribute = /*#__PURE__*/new WeakSet();

  var _handleProp = /*#__PURE__*/new WeakSet();

  var _complete = /*#__PURE__*/new WeakSet();

  var _resetCounters = /*#__PURE__*/new WeakSet();

  var _reset = /*#__PURE__*/new WeakSet();

  var _clear = /*#__PURE__*/new WeakSet();

  var UploadUserIDsView = /*#__PURE__*/_createClass(function UploadUserIDsView(elm) {
    var _this = this;

    _classCallCheck(this, UploadUserIDsView);

    _classPrivateMethodInitSpec(this, _clear);

    _classPrivateMethodInitSpec(this, _reset);

    _classPrivateMethodInitSpec(this, _resetCounters);

    _classPrivateMethodInitSpec(this, _complete);

    _classPrivateMethodInitSpec(this, _handleProp);

    _classPrivateMethodInitSpec(this, _getAttribute);

    _classPrivateMethodInitSpec(this, _prepareProgressIndicator);

    _classPrivateMethodInitSpec(this, _fetch);

    _classPrivateFieldInitSpec(this, _ROOT, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _BODY, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _USER_IDS, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _progressIndicator, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _source, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _offset, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _errorCount, {
      writable: true,
      value: void 0
    });

    // TODO: set axios settings in common file
    // TODO: set 'user cancel' as a const in axios setting file
    axios.defaults.timeout = 120000;
    axiosRetry(axios, {
      retries: 5,
      shouldResetTimeout: true,
      retryDelay: function retryDelay(retryCount) {
        return Math.pow(2, retryCount - 1) * 5000;
      },
      retryCondition: function retryCondition(error) {
        var _error$response;

        return error.code === timeOutError || [500, 503].includes((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status);
      }
    });

    _classPrivateFieldSet(this, _ROOT, elm);

    _classPrivateFieldSet(this, _offset, 0);

    _classPrivateFieldSet(this, _errorCount, 0);

    _classPrivateFieldSet(this, _BODY, document.querySelector('body'));

    _classPrivateFieldSet(this, _USER_IDS, elm.querySelector(':scope > textarea'));

    elm.appendChild(document.createElement('div'));

    _classPrivateFieldSet(this, _progressIndicator, new ProgressIndicator(elm.lastChild, 'simple')); // attach events


    elm.querySelector(':scope > .title > .button > button').addEventListener('click', function () {
      _classPrivateFieldGet(_this, _USER_IDS).value = _classPrivateFieldGet(_this, _USER_IDS).placeholder.replace('e.g. ', '');

      _classPrivateFieldGet(_this, _USER_IDS).dispatchEvent(new Event('change'));

      submitButton.dispatchEvent(new Event('click'));
    });
    var buttons = elm.querySelector(':scope > .buttons');
    var submitButton = buttons.querySelector(':scope > button:nth-child(1)');
    submitButton.addEventListener('click', function (e) {
      e.stopPropagation(); // clear after 2nd execution

      if (_classPrivateFieldGet(_this, _source)) _classPrivateMethodGet(_this, _reset, _reset2).call(_this, true);

      _classPrivateMethodGet(_this, _fetch, _fetch2).call(_this);

      return false;
    });
    buttons.querySelector(':scope > button:nth-child(2)').addEventListener('click', function (e) {
      e.stopPropagation();

      _classPrivateMethodGet(_this, _clear, _clear2).call(_this);

      return false;
    }); // event listeners

    _classPrivateFieldGet(this, _USER_IDS).addEventListener('change', function () {
      ConditionBuilder$1.setUserIds(_classPrivateFieldGet(_this, _USER_IDS).value);
    }); // this.#USER_IDS.addEventListener('keyup', e => {
    //   if (e.keyCode === 13) this.#fetch();
    // });
    // DefaultEventEmitter.addEventListener(event.restoreParameters, this.#restoreParameters.bind(this));


    DefaultEventEmitter$1.addEventListener(clearCondition, _classPrivateMethodGet(this, _clear, _clear2).bind(this));
  } // private methods
  // #restoreParameters({detail}) {
  //   this.#USER_IDS.value = detail.userIds;
  // }
  );

  function _fetch2() {
    var _this2 = this;

    if (_classPrivateFieldGet(this, _USER_IDS).value === '') return;

    _classPrivateMethodGet(this, _prepareProgressIndicator, _prepareProgressIndicator2).call(this);

    Records$1.attributes.forEach(function (attribute) {
      // TODO: この処理は Attribute に移行
      _classPrivateMethodGet(_this2, _getAttribute, _getAttribute2).call(_this2, attribute);
    });
  }

  function _prepareProgressIndicator2() {
    // reset axios cancellation
    var CancelToken = axios.CancelToken;

    _classPrivateFieldSet(this, _source, CancelToken.source());

    _classPrivateFieldGet(this, _ROOT).classList.add('-fetching');

    _classPrivateFieldGet(this, _ROOT).dataset.status = '';

    _classPrivateFieldGet(this, _progressIndicator).setIndicator('In progress', Records$1.attributes.length);
  }

  function _getAttribute2(_ref) {
    var _this3 = this;

    var id = _ref.id;
    axios.post(App$1.getApiUrl('locate'), getApiParameter('locate', {
      attribute: id,
      node: '',
      dataset: ConditionBuilder$1.currentTogoKey,
      queries: ConditionBuilder$1.userIds
    }), {
      cancelToken: _classPrivateFieldGet(this, _source).token
    }).then(function (response) {
      _classPrivateFieldGet(_this3, _BODY).classList.add('-showuserids');

      _classPrivateMethodGet(_this3, _handleProp, _handleProp2).call(_this3);

      var __temp__data = response.data.map(function (datum) {
        return {
          categoryId: datum.node,
          count: datum.count,
          hit_count: datum.mapped,
          label: datum.label,
          pValue: datum.pvalue
        };
      }); // dispatch event


      var customEvent = new CustomEvent(setUserValues, {
        detail: {
          attributeId: id,
          // values: values,
          values: __temp__data
        }
      });
      DefaultEventEmitter$1.dispatchEvent(customEvent);
    }).catch(function (error) {

      if (axios.isCancel && error.message === 'user cancel') return;
      var customEvent = new CustomEvent(toggleErrorUserValues, {
        detail: {
          mode: 'show',
          attributeId: id,
          message: 'Failed to map this ID'
        }
      });
      DefaultEventEmitter$1.dispatchEvent(customEvent);

      _classPrivateMethodGet(_this3, _handleProp, _handleProp2).call(_this3);

      _classPrivateFieldSet(_this3, _errorCount, (+_classPrivateFieldGet(_this3, _errorCount)) + 1);
    }).then(function () {
      if (_classPrivateFieldGet(_this3, _offset) >= Records$1.attributes.length) {
        _classPrivateMethodGet(_this3, _complete, _complete2).call(_this3, _classPrivateFieldGet(_this3, _errorCount) > 0);
      }
    });
  }

  function _handleProp2() {
    _classPrivateFieldSet(this, _offset, _classPrivateFieldGet(this, _offset) + 1);

    _classPrivateFieldGet(this, _progressIndicator).updateProgressBar({
      offset: _classPrivateFieldGet(this, _offset)
    });
  }

  function _complete2() {
    var withError = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var msg = withError ? "Failed to map IDs for ".concat(_classPrivateFieldGet(this, _errorCount), " attribute").concat(_classPrivateFieldGet(this, _errorCount) > 1 ? 's' : '') : 'Mapping completed';

    _classPrivateFieldGet(this, _progressIndicator).setIndicator(msg, undefined, withError);

    _classPrivateFieldGet(this, _ROOT).dataset.status = 'complete';
  }

  function _resetCounters2() {
    _classPrivateFieldSet(this, _offset, 0);

    _classPrivateFieldSet(this, _errorCount, 0);
  }

  function _reset2() {
    var _classPrivateFieldGet2;

    var isPreparing = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _source)) === null || _classPrivateFieldGet2 === void 0 ? void 0 : _classPrivateFieldGet2.cancel('user cancel');

    _classPrivateMethodGet(this, _resetCounters, _resetCounters2).call(this);

    var customEvent = new CustomEvent(clearUserValues);
    DefaultEventEmitter$1.dispatchEvent(customEvent);
    var customEvent2 = new CustomEvent(toggleErrorUserValues, {
      detail: {
        mode: 'hide'
      }
    });
    DefaultEventEmitter$1.dispatchEvent(customEvent2);

    _classPrivateFieldGet(this, _progressIndicator).reset();

    _classPrivateFieldGet(this, _BODY).classList.remove('-showuserids');

    if (isPreparing) return;
    ConditionBuilder$1.setUserIds();
    _classPrivateFieldGet(this, _USER_IDS).value = '';
  }

  function _clear2() {
    _classPrivateMethodGet(this, _reset, _reset2).call(this);

    _classPrivateMethodGet(this, _complete, _complete2).call(this);
  }

  var _viewModes = /*#__PURE__*/new WeakMap();

  var _backend = /*#__PURE__*/new WeakMap();

  var _colorWhite = /*#__PURE__*/new WeakMap();

  var _colorLightGray = /*#__PURE__*/new WeakMap();

  var _colorSilver = /*#__PURE__*/new WeakMap();

  var _colorGray = /*#__PURE__*/new WeakMap();

  var _colorDarkGray = /*#__PURE__*/new WeakMap();

  var _colorLampBlack = /*#__PURE__*/new WeakMap();

  var _makeCategoryViews = /*#__PURE__*/new WeakSet();

  var _defineAllTracksCollapseButton = /*#__PURE__*/new WeakSet();

  var App = /*#__PURE__*/function () {
    function App() {
      _classCallCheck(this, App);

      _classPrivateMethodInitSpec(this, _defineAllTracksCollapseButton);

      _classPrivateMethodInitSpec(this, _makeCategoryViews);

      _classPrivateFieldInitSpec(this, _viewModes, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _backend, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _colorWhite, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _colorLightGray, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _colorSilver, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _colorGray, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _colorDarkGray, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldInitSpec(this, _colorLampBlack, {
        writable: true,
        value: void 0
      });

      _classPrivateFieldSet(this, _colorWhite, new h('white').to('srgb'));

      _classPrivateFieldSet(this, _colorLightGray, new h('--color-light-gray').to('srgb'));

      _classPrivateFieldSet(this, _colorLightGray, new h('--color-light-gray').to('srgb'));

      _classPrivateFieldSet(this, _colorSilver, new h('--color-silver').to('srgb'));

      _classPrivateFieldSet(this, _colorGray, new h('--color-gray').to('srgb'));

      _classPrivateFieldSet(this, _colorDarkGray, new h('--color-dark-gray').to('srgb'));

      _classPrivateFieldSet(this, _colorLampBlack, new h('--color-lamp-black').to('srgb'));
    }

    _createClass(App, [{
      key: "ready",
      value: function ready(config) {
        var _this = this;

        var body = document.body; // view modes

        _classPrivateFieldSet(this, _viewModes, {});

        document.querySelectorAll('#Properties > .header > nav .viewmodecontroller input[type="checkbox"]').forEach(function (checkbox) {
          _classPrivateFieldGet(_this, _viewModes)[checkbox.value] = checkbox.checked;
          checkbox.addEventListener('click', function () {
            if (checkbox.value === 'heatmap') body.dataset.heatmap = checkbox.checked;
            _classPrivateFieldGet(_this, _viewModes)[checkbox.value] = checkbox.checked;
            var customEvent = new CustomEvent(changeViewModes, {
              detail: _classPrivateFieldGet(_this, _viewModes)
            });
            DefaultEventEmitter$1.dispatchEvent(customEvent);
          });
        }); // events

        DefaultEventEmitter$1.addEventListener(restoreParameters, function () {
          document.querySelector('#App > .loading-view').classList.remove('-shown');
        }); // set up views

        new ConditionBuilderView(document.querySelector('#ConditionBuilder'));
        new ConditionsController(document.querySelector('#Conditions'));
        new ResultsTable(document.querySelector('#ResultsTable'));
        new ResultDetailModal();
        new BalloonView();
        new UploadUserIDsView(document.querySelector('#UploadUserIDsView')); // load config json

        Promise.all([fetch(config.TEMPLATES), fetch(config.BACKEND), fetch(config.ATTRIBUTES)]).then(function (responces) {
          return Promise.all(responces.map(function (responce) {
            return responce.json();
          }));
        }).then(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 3),
              templates = _ref2[0],
              backend = _ref2[1],
              attributes = _ref2[2];

          Records$1.setAttributes(attributes); // define primary keys

          var customEvent = new CustomEvent(defineTogoKey, {
            detail: {
              datasets: attributes.datasets
            }
          });
          DefaultEventEmitter$1.dispatchEvent(customEvent); // initialize stanza manager

          StanzaManager$1.init(templates); // aggregate

          _classPrivateFieldSet(_this, _backend, Object.freeze(backend));

          _classPrivateMethodGet(_this, _makeCategoryViews, _makeCategoryViews2).call(_this);

          _classPrivateMethodGet(_this, _defineAllTracksCollapseButton, _defineAllTracksCollapseButton2).call(_this);

          ConditionBuilder$1.init();
        });
      } // private methods

    }, {
      key: "getApiUrl",
      value: // public methods

      /**
       * 
       * @param {String} api 'aggregate' or 'dataframe' or 'locate'
       * @returns 
       */
      function getApiUrl(api) {
        return _classPrivateFieldGet(this, _backend)[api].url;
      } // accessor

    }, {
      key: "viewModes",
      get: function get() {
        return _classPrivateFieldGet(this, _viewModes);
      } // get aggregate() {
      //   return this.#backend.aggregate.url;
      // }
      // get dataframe() {
      //   return this.#backend.dataframe.url;
      // }
      // get locate() {
      //   return this.#backend.locate.url;
      // }

    }, {
      key: "colorWhite",
      get: function get() {
        return _classPrivateFieldGet(this, _colorWhite);
      }
    }, {
      key: "colorLightGray",
      get: function get() {
        return _classPrivateFieldGet(this, _colorLightGray);
      }
    }, {
      key: "colorSilver",
      get: function get() {
        return _classPrivateFieldGet(this, _colorSilver);
      }
    }, {
      key: "colorGray",
      get: function get() {
        return _classPrivateFieldGet(this, _colorGray);
      }
    }, {
      key: "colorDarkGray",
      get: function get() {
        return _classPrivateFieldGet(this, _colorDarkGray);
      }
    }, {
      key: "colorLampBlack",
      get: function get() {
        return _classPrivateFieldGet(this, _colorLampBlack);
      }
    }]);

    return App;
  }();

  function _makeCategoryViews2() {
    var conceptsContainer = document.querySelector('#Properties > .concepts');
    Records$1.catexxxgories.forEach(function (category) {
      var elm = document.createElement('section');
      new CategoryView(category, elm);
      conceptsContainer.insertAdjacentElement('beforeend', elm);
    });
  }

  function _defineAllTracksCollapseButton2() {
    var collapsebutton = document.querySelector('#Properties > header > .title > h2.collapsebutton');
    collapsebutton.addEventListener('click', function (e) {
      var customEvent = new CustomEvent(allTracksCollapse);

      if (collapsebutton.classList.contains('-spread')) {
        collapsebutton.classList.remove('-spread');
        customEvent = new CustomEvent(allTracksCollapse, {
          detail: false
        });
      } else {
        collapsebutton.classList.add('-spread');
        customEvent = new CustomEvent(allTracksCollapse, {
          detail: true
        });
      }

      DefaultEventEmitter$1.dispatchEvent(customEvent);
    });
  }

  var App$1 = new App();

  fetch('./config.json').then(function (response) {
    return response.json();
  }).then(function (api) {
    globalThis.togositeapp = App$1;
    App$1.ready(api);
  });

})();
//# sourceMappingURL=main.js.map
