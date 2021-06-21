(function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
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
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
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

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
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
            s = _objectWithoutProperties(_r5, ["method"]);

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
            e = _objectWithoutProperties(_ref9, ["format"]);

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
            e = _objectWithoutProperties(_ref10, ["format"]);

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
            a = _objectWithoutProperties(_ref12, ["inGamut", "commas", "format"]);

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
            var s = _objectWithoutProperties(_ref13, ["precision", "commas", "format", "inGamut"]);

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
            var a = _objectWithoutProperties(_ref14, ["format", "commas", "inGamut"]);

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
            e = _objectWithoutProperties(_ref15, ["format"]);

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
        c = _objectWithoutProperties(_r10, ["maxDeltaE", "deltaEMethod", "steps", "maxSteps"]);

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

  var _subjects = new WeakMap();

  var _properties = new WeakMap();

  var _fetchedCategoryIds = new WeakMap();

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

      _fetchedCategoryIds.set(this, {
        writable: true,
        value: void 0
      });
    } // public methods


    _createClass(Records, [{
      key: "setSubjects",
      value: function setSubjects(subjects) {
        var _this = this;

        console.log(subjects); // define subjects

        for (var i = 0; i < subjects.length; i++) {
          var hue = 360 - 360 * i / subjects.length + 130;
          hue -= hue > 360 ? 360 : 0;
          var srgb = new h('hsv', [hue, 45, 85]).to('srgb');
          var srgbStrong = new h('hsv', [hue, 65, 65]).to('srgb');
          subjects[i].hue = hue;
          subjects[i].color = srgb;
          subjects[i].colorCSSValue = "rgb(".concat(srgb.coords.map(function (channel) {
            return channel * 256;
          }).join(','), ")");
          subjects[i].colorCSSStrongValue = "rgb(".concat(srgbStrong.coords.map(function (channel) {
            return channel * 256;
          }).join(','), ")");
        }

        _classPrivateFieldSet(this, _subjects, Object.freeze(subjects)); // set properties


        _classPrivateFieldSet(this, _properties, []);

        _classPrivateFieldSet(this, _fetchedCategoryIds, {});

        subjects.forEach(function (subject) {
          subject.properties.forEach(function (property) {
            _classPrivateFieldGet(_this, _properties).push(Object.assign({
              subjectId: subject.subjectId,
              values: []
            }, property));

            _classPrivateFieldGet(_this, _fetchedCategoryIds)[property.propertyId] = [];
          });
        });
        console.log(_classPrivateFieldGet(this, _subjects));
        console.log(_classPrivateFieldGet(this, _properties));
        console.log(_classPrivateFieldGet(this, _fetchedCategoryIds)); // make stylesheet

        var styleElm = document.createElement('style');
        document.head.appendChild(styleElm);
        var styleSheet = styleElm.sheet;
        styleSheet.insertRule(":root {\n      ".concat(subjects.map(function (subject) {
          return "\n        --color-subject-".concat(subject.subjectId, ": ").concat(subject.colorCSSValue, ";\n        --color-subject-").concat(subject.subjectId, "-strong: ").concat(subject.colorCSSStrongValue, ";\n        ");
        }).join(''), "\n    }"));

        var _iterator = _createForOfIteratorHelper(subjects),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var subject = _step.value;
            styleSheet.insertRule("\n      ._subject-color[data-subject-id=\"".concat(subject.subjectId, "\"], [data-subject-id=\"").concat(subject.subjectId, "\"] ._subject-color {\n        color: var(--color-subject-").concat(subject.subjectId, "-strong);\n      }"));
            styleSheet.insertRule("\n      ._subject-background-color[data-subject-id=\"".concat(subject.subjectId, "\"], [data-subject-id=\"").concat(subject.subjectId, "\"] ._subject-background-color {\n        background-color: var(--color-subject-").concat(subject.subjectId, ");\n      }"));
            styleSheet.insertRule("\n      ._subject-border-color[data-subject-id=\"".concat(subject.subjectId, "\"], [data-subject-id=\"").concat(subject.subjectId, "\"] ._subject-border-color {\n        border-color: var(--color-subject-").concat(subject.subjectId, ");\n      }"));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }, {
      key: "fetchPropertyValues",
      value: function fetchPropertyValues(propertyId, categoryId) {
        var _this2 = this;

        var property = this.getProperty(propertyId);
        return new Promise(function (resolve, reject) {
          if (categoryId && _classPrivateFieldGet(_this2, _fetchedCategoryIds)[propertyId].indexOf(categoryId) !== -1) {
            resolve(property.values.filter(function (value) {
              return value.parentCategoryId === categoryId;
            }));
          } else {
            fetch("".concat(property.data).concat(categoryId ? "?categoryIds=".concat(categoryId) : '')).then(function (responce) {
              return responce.json();
            }).then(function (values) {
              var _property$values;

              // set parent category id
              if (categoryId) values.forEach(function (value) {
                return value.parentCategoryId = categoryId;
              }); // set values

              (_property$values = property.values).push.apply(_property$values, _toConsumableArray(values));

              resolve(values);
            }).catch(function (error) {
              return reject(error);
            });
          }
        });
      }
    }, {
      key: "getSubject",
      value: function getSubject(subjectId) {
        return _classPrivateFieldGet(this, _subjects).find(function (subject) {
          return subject.subjectId === subjectId;
        });
      }
    }, {
      key: "getSubjectWithPropertyId",
      value: function getSubjectWithPropertyId(propertyId) {
        var subject = _classPrivateFieldGet(this, _subjects).find(function (subject) {
          return subject.properties.some(function (property) {
            return property.propertyId === propertyId;
          });
        });

        return subject;
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
        var property = this.getProperty(propertyId);
        var value = property.values.find(function (value) {
          return value.categoryId === categoryId;
        });
        return value;
      }
    }, {
      key: "getValuesWithParentCategoryId",
      value: function getValuesWithParentCategoryId(propertyId, parentCategoryId) {
        var property = this.getProperty(propertyId);
        return property.values.filter(function (value) {
          return value.parentCategoryId === parentCategoryId;
        });
      }
    }, {
      key: "getAncestors",
      value: function getAncestors(propertyId, categoryId) {
        var property = this.getProperty(propertyId);
        var ancestors = [];
        var parent;

        do {
          var _parent;

          // find ancestors
          parent = property.values.find(function (value) {
            return value.categoryId === categoryId;
          });
          if (parent) ancestors.unshift(parent);
          categoryId = (_parent = parent) === null || _parent === void 0 ? void 0 : _parent.parentCategoryId;
        } while (parent);

        ancestors.pop();
        return ancestors;
      }
    }, {
      key: "getLabelFromTogoKey",
      value: function getLabelFromTogoKey(togoKey) {
        return _classPrivateFieldGet(this, _subjects).find(function (subject) {
          return subject.togoKey === togoKey;
        }).keyLabel;
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

  var _templates = new WeakMap();

  var _isReady = new WeakMap();

  var StanzaManager = /*#__PURE__*/function () {
    function StanzaManager() {
      _classCallCheck(this, StanzaManager);

      _templates.set(this, {
        writable: true,
        value: void 0
      });

      _isReady.set(this, {
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

          console.log(_classPrivateFieldGet(_this, _templates));
        });
      }
      /**
       * 
       * @param {String} subjectId  e.g. gene, protein (category name)
       * @param {String} id  ID of dataset
       * @param {String} key  e.g. hgnc, uniplot (dataset name)
       * @returns {String} HTML
       */

    }, {
      key: "draw",
      value: function draw(subjectId, id, key) {
        return "<div class=\"stanza\">".concat(_classPrivateFieldGet(this, _templates)[subjectId].replace(/{{id}}/g, id).replace(/{{type}}/g, key), "</div>");
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

  var PROPERTIES = 'https://raw.githubusercontent.com/dbcls/togosite/develop/config/togosite-human/properties.json';
  var TEMPLATES = 'https://raw.githubusercontent.com/dbcls/togosite/develop/config/togosite-human/templates.json';

  var _drawStanzas = new WeakSet();

  var ReportApp = /*#__PURE__*/function () {
    function ReportApp() {
      _classCallCheck(this, ReportApp);

      _drawStanzas.add(this);
    }

    _createClass(ReportApp, [{
      key: "ready",
      value: function ready() {
        var _this = this;

        // load config json
        Promise.all([fetch(PROPERTIES), fetch(TEMPLATES)]).then(function (responces) {
          return Promise.all(responces.map(function (responce) {
            return responce.json();
          }));
        }).then(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              subjects = _ref2[0],
              templates = _ref2[1];

          Records$1.setSubjects(subjects); // initialize stanza manager

          StanzaManager$1.init(templates); // wait ready stanza manager

          var intervalId = window.setInterval(function () {
            console.log(StanzaManager$1.isReady);

            if (StanzaManager$1.isReady) {
              window.clearInterval(intervalId);

              _classPrivateMethodGet(_this, _drawStanzas, _drawStanzas2).call(_this);
            }
          }, 100);
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
    var properties = JSON.parse(decodeURIComponent(RawDeflate.inflate(window.atob(urlVars.properties))));
    var main = document.querySelector('main');
    var subjectId = Records$1.subjects.find(function (subject) {
      return subject.togoKey === urlVars.togoKey;
    }).subjectId;
    main.innerHTML = StanzaManager$1.draw(subjectId, urlVars.id, urlVars.togoKey) + properties.map(function (property) {
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
        return "<hr>\n          <div class=\"attributes\">\n            <header style=\"background-color: ".concat(_this2.getHslColor(subject.colorCSSValue), ";\">").concat(property2.label, "</header>\n            ").concat(property.attributes.map(function (attribute) {
          return StanzaManager$1.draw(subject.subjectId, attribute.id, property.propertyKey);
        }).join(''), "\n          </div>");
      }
    }).join('');
    main.querySelectorAll('script').forEach(function (scriptElement) {
      var _script = document.createElement('script');

      _script.textContent = scriptElement.textContent;
      scriptElement.replaceWith(_script);
    });
  }

  var ReportApp$1 = new ReportApp();

  globalThis.togositeapp = ReportApp$1;
  ReportApp$1.ready();

}());
//# sourceMappingURL=report.js.map
