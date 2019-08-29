'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Elements = require('./../objects/Elements');

var Actions = require('./../objects/Actions');

var HTMLTunedElement =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(HTMLTunedElement, _HTMLElement);

  function HTMLTunedElement() {
    var _this;

    _classCallCheck(this, HTMLTunedElement);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HTMLTunedElement).call(this));
    _this.rendered = false;
    return _this;
  } // PUBLIC


  _createClass(HTMLTunedElement, [{
    key: "attributesWithStorageVariables",
    value: function attributesWithStorageVariables() {
      return [];
    }
  }, {
    key: "replacedWith",
    value: function replacedWith(elm) {
      var instance = this;
      instance.getAttributeNames().forEach(function (name) {
        elm.setAttribute(name, instance.getAttribute(name));
      });

      while (instance.firstChild) {
        var child = instance.removeChild(instance.firstChild);
        elm.appendChild(child);
      }

      instance.parentNode.replaceChild(elm, instance);
      return elm;
    }
  }, {
    key: "supportedActions",
    value: function supportedActions() {
      return [];
    }
  }, {
    key: "runActions",
    value: function runActions(values) {
      var actionsCommand = this.getAttribute('data-actions');

      if (actionsCommand) {
        new Actions(this.tagName, actionsCommand, this.supportedActions()).run(values);
      }
    } // PRIVATE

  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this2 = this,
          _ref;

      var instance = this;
      var attributesWithStorageVariables = this.attributesWithStorageVariables().concat(this.defaultAttributesWithStorageVariables()).filter(function (attr) {
        return _this2.getAttribute(attr);
      });

      (_ref = new Elements(this)).applyStorageVariablesInAttributes.apply(_ref, _toConsumableArray(attributesWithStorageVariables));

      setTimeout(function () {
        if (!instance.rendered) {
          instance.render();
          instance.rendered = true;
        }
      });
    }
  }, {
    key: "defaultAttributesWithStorageVariables",
    value: function defaultAttributesWithStorageVariables() {
      return ['data-actions'];
    }
  }]);

  return HTMLTunedElement;
}(_wrapNativeSuper(HTMLElement));

module.exports = HTMLTunedElement;
