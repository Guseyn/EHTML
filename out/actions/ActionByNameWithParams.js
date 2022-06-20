'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require('./../cutie/exports'),
    AsyncObject = _require.AsyncObject;

var _require2 = require('./../async-ajax/exports'),
    ResponseFromAjaxRequest = _require2.ResponseFromAjaxRequest,
    ResponseBody = _require2.ResponseBody;

var _require3 = require('./../async-object/exports'),
    CreatedOptions = _require3.CreatedOptions;

var _require4 = require('./../async-dom/exports'),
    ElementWithInnerHTML = _require4.ElementWithInnerHTML,
    ElementWithAdditionalHTML = _require4.ElementWithAdditionalHTML,
    ElementWithTextContent = _require4.ElementWithTextContent,
    HiddenElements = _require4.HiddenElements,
    ShownElements = _require4.ShownElements,
    DisabledElements = _require4.DisabledElements,
    EnabledElements = _require4.EnabledElements,
    ElementWithMappedObject = _require4.ElementWithMappedObject,
    ElementsWithToggledClass = _require4.ElementsWithToggledClass,
    ElementWithChangedValue = _require4.ElementWithChangedValue,
    ElementWithChangedAttribute = _require4.ElementWithChangedAttribute,
    ParsedElmSelectors = _require4.ParsedElmSelectors,
    RemovedElements = _require4.RemovedElements,
    ScrolledIntoView = _require4.ScrolledIntoView;

var _require5 = require('./../async-log/exports'),
    Logged = _require5.Logged;

var _require6 = require('./../async-if-else/exports'),
    If = _require6.If;

var _require7 = require('./../async-location/exports'),
    RedirectedLocation = _require7.RedirectedLocation,
    ReloadedLocation = _require7.ReloadedLocation,
    TurboRedirected = _require7.TurboRedirected;

var _require8 = require('./../async-storage/exports'),
    LocalStorageWithSetValue = _require8.LocalStorageWithSetValue,
    SessionStorageWithSetValue = _require8.SessionStorageWithSetValue,
    LocalStorageWithRemovedValue = _require8.LocalStorageWithRemovedValue,
    SessionStorageWithRemovedValue = _require8.SessionStorageWithRemovedValue;

var _require9 = require('./../async-array/exports'),
    First = _require9.First;

var _require10 = require('./../async-uri/exports'),
    EncodedURI = _require10.EncodedURI;

var actions = {
  "if": function _if(statement, action) {
    return new If(statement, action);
  },
  logToConsole: function logToConsole() {
    for (var _len = arguments.length, objs = new Array(_len), _key = 0; _key < _len; _key++) {
      objs[_key] = arguments[_key];
    }

    return _construct(Logged, objs);
  },
  mapToTemplate: function mapToTemplate(obj, elmSelector) {
    return new ElementWithMappedObject(new First(new ParsedElmSelectors(elmSelector)), obj);
  },
  redirect: function redirect(url) {
    return new RedirectedLocation(new EncodedURI(url));
  },
  reload: function reload() {
    return new ReloadedLocation();
  },
  turboRedirect: function turboRedirect(href, headers) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        progressBarPlace = _ref.progressBarPlace,
        progressBarClassName = _ref.progressBarClassName,
        ajaxFavicon = _ref.ajaxFavicon;

    return new TurboRedirected(href, headers, {
      progressBarPlace: progressBarPlace,
      progressBarClassName: progressBarClassName,
      ajaxFavicon: ajaxFavicon
    });
  },
  saveToLocalStorage: function saveToLocalStorage(key, value) {
    return new LocalStorageWithSetValue(localStorage, key, value);
  },
  saveToSessionStorage: function saveToSessionStorage(key, value) {
    return new SessionStorageWithSetValue(sessionStorage, key, value);
  },
  removeFromLocalStorage: function removeFromLocalStorage(key) {
    return new LocalStorageWithRemovedValue(localStorage, key);
  },
  removeFromSessionStorage: function removeFromSessionStorage(key, value) {
    return new SessionStorageWithRemovedValue(sessionStorage, key);
  },
  hideElms: function hideElms() {
    for (var _len2 = arguments.length, elmSelectors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      elmSelectors[_key2] = arguments[_key2];
    }

    return new HiddenElements(_construct(ParsedElmSelectors, elmSelectors));
  },
  showElms: function showElms() {
    for (var _len3 = arguments.length, elmSelectors = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      elmSelectors[_key3] = arguments[_key3];
    }

    return new ShownElements(_construct(ParsedElmSelectors, elmSelectors));
  },
  disableElms: function disableElms() {
    for (var _len4 = arguments.length, elmSelectors = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      elmSelectors[_key4] = arguments[_key4];
    }

    return new DisabledElements(_construct(ParsedElmSelectors, elmSelectors));
  },
  enableElms: function enableElms() {
    for (var _len5 = arguments.length, elmSelectors = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      elmSelectors[_key5] = arguments[_key5];
    }

    return new EnabledElements(_construct(ParsedElmSelectors, elmSelectors));
  },
  removeElms: function removeElms() {
    for (var _len6 = arguments.length, elmSelectors = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      elmSelectors[_key6] = arguments[_key6];
    }

    return new RemovedElements(_construct(ParsedElmSelectors, elmSelectors));
  },
  toggleElms: function toggleElms(className) {
    for (var _len7 = arguments.length, elmSelectors = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      elmSelectors[_key7 - 1] = arguments[_key7];
    }

    return new ElementsWithToggledClass(className, _construct(ParsedElmSelectors, elmSelectors));
  },
  innerHTML: function innerHTML(elmSelector, url, headers) {
    return new ElementWithInnerHTML(new First(new ParsedElmSelectors(elmSelector)), new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', new EncodedURI(url), 'method', 'GET', 'headers', headers))));
  },
  innerHTMLFromResponse: function innerHTMLFromResponse(elmSelector, htmlStringFromObject) {
    return new ElementWithInnerHTML(new First(new ParsedElmSelectors(elmSelector)), htmlStringFromObject);
  },
  addHTMLTo: function addHTMLTo(elmSelector, url, headers) {
    return new ElementWithAdditionalHTML(new First(new ParsedElmSelectors(elmSelector)), new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', new EncodedURI(url), 'method', 'GET', 'headers', headers))));
  },
  addHTMLFromResponse: function addHTMLFromResponse(elmSelector, htmlStringFromObject) {
    return new ElementWithAdditionalHTML(new First(new ParsedElmSelectors(elmSelector)), htmlStringFromObject);
  },
  textContent: function textContent(elmSelector, url, headers) {
    return new ElementWithTextContent(new First(new ParsedElmSelectors(elmSelector)), new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', new EncodedURI(url), 'method', 'GET', 'headers', headers))));
  },
  textContentFromResponse: function textContentFromResponse(elmSelector, stringFromObject) {
    return new ElementWithTextContent(new First(new ParsedElmSelectors(elmSelector)), stringFromObject);
  },
  changeValueOf: function changeValueOf(elmSelector, newValue) {
    return new ElementWithChangedValue(new First(new ParsedElmSelectors(elmSelector)), newValue);
  },
  updateAttribute: function updateAttribute(elmSelector, attrName, attrValue) {
    return new ElementWithChangedAttribute(new First(new ParsedElmSelectors(elmSelector)), attrName, attrValue);
  },
  scrollIntoView: function scrollIntoView(elmSelector) {
    return new ScrolledIntoView(new First(new ParsedElmSelectors(elmSelector)));
  }
};

var CustomAction =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(CustomAction, _AsyncObject);

  function CustomAction(func) {
    var _getPrototypeOf2;

    _classCallCheck(this, CustomAction);

    for (var _len8 = arguments.length, params = new Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
      params[_key8 - 1] = arguments[_key8];
    }

    return _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CustomAction)).call.apply(_getPrototypeOf2, [this, func].concat(params)));
  }

  _createClass(CustomAction, [{
    key: "syncCall",
    value: function syncCall() {
      return function (func) {
        for (var _len9 = arguments.length, params = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
          params[_key9 - 1] = arguments[_key9];
        }

        func.apply(void 0, params);
      };
    }
  }]);

  return CustomAction;
}(AsyncObject);

var ActionByNameWithParams =
/*#__PURE__*/
function () {
  function ActionByNameWithParams(name) {
    _classCallCheck(this, ActionByNameWithParams);

    this.name = name;

    for (var _len10 = arguments.length, params = new Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
      params[_key10 - 1] = arguments[_key10];
    }

    this.params = params;
  }

  _createClass(ActionByNameWithParams, [{
    key: "value",
    value: function value() {
      if (!actions[this.name]) {
        if (typeof window[this.name] === 'function') {
          return _construct(CustomAction, [window[this.name]].concat(_toConsumableArray(this.params)));
        }

        throw new Error("no such action with name \"".concat(this.name, "\", nor such function in global scope (in window)"));
      }

      return actions[this.name].apply(actions, _toConsumableArray(this.params));
    }
  }]);

  return ActionByNameWithParams;
}();

module.exports = ActionByNameWithParams;
