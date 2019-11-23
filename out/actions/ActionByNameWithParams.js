'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require('./../async-ajax/exports'),
    ResponseFromAjaxRequest = _require.ResponseFromAjaxRequest,
    ResponseBody = _require.ResponseBody;

var _require2 = require('./../async-object/exports'),
    CreatedOptions = _require2.CreatedOptions;

var _require3 = require('./../async-dom/exports'),
    ElementWithInnerHTML = _require3.ElementWithInnerHTML,
    ElementWithAdditionalHTML = _require3.ElementWithAdditionalHTML,
    ElementWithTextContent = _require3.ElementWithTextContent,
    HiddenElements = _require3.HiddenElements,
    ShownElements = _require3.ShownElements,
    DisabledElements = _require3.DisabledElements,
    EnabledElements = _require3.EnabledElements,
    ElementWithMappedObject = _require3.ElementWithMappedObject,
    ElementsWithToggledClass = _require3.ElementsWithToggledClass,
    ElementWithChangedValue = _require3.ElementWithChangedValue,
    ElementWithChangedAttribute = _require3.ElementWithChangedAttribute,
    ParsedElmSelectors = _require3.ParsedElmSelectors;

var _require4 = require('./../async-log/exports'),
    Logged = _require4.Logged;

var _require5 = require('./../async-if-else/exports'),
    If = _require5.If;

var _require6 = require('./../async-location/exports'),
    RedirectedLocation = _require6.RedirectedLocation,
    ReloadedLocation = _require6.ReloadedLocation,
    TurboRedirected = _require6.TurboRedirected;

var _require7 = require('./../async-storage/exports'),
    LocalStorageWithSetValue = _require7.LocalStorageWithSetValue,
    SessionStorageWithSetValue = _require7.SessionStorageWithSetValue,
    LocalStorageWithRemovedValue = _require7.LocalStorageWithRemovedValue,
    SessionStorageWithRemovedValue = _require7.SessionStorageWithRemovedValue;

var _require8 = require('./../async-array/exports'),
    First = _require8.First;

var _require9 = require('./../async-uri/exports'),
    EncodedURI = _require9.EncodedURI;

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
  toggleElms: function toggleElms(className) {
    for (var _len6 = arguments.length, elmSelectors = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      elmSelectors[_key6 - 1] = arguments[_key6];
    }

    return new ElementsWithToggledClass(className, _construct(ParsedElmSelectors, elmSelectors));
  },
  innerHTML: function innerHTML(elmSelector, url, headers) {
    return new ElementWithInnerHTML(new First(new ParsedElmSelectors(elmSelector)), new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', new EncodedURI(url), 'method', 'GET', 'headers', headers))));
  },
  addHTMLTo: function addHTMLTo(elmSelector, url, headers) {
    return new ElementWithAdditionalHTML(new First(new ParsedElmSelectors(elmSelector)), new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', new EncodedURI(url), 'method', 'GET', 'headers', headers))));
  },
  textContent: function textContent(elmSelector, url, headers) {
    return new ElementWithTextContent(new First(new ParsedElmSelectors(elmSelector)), new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', new EncodedURI(url), 'method', 'GET', 'headers', headers))));
  },
  changeValueOf: function changeValueOf(elmSelector, newValue) {
    return new ElementWithChangedValue(new First(new ParsedElmSelectors(elmSelector)), newValue);
  },
  updateAttribute: function updateAttribute(elmSelector, attrName, attrValue) {
    return new ElementWithChangedAttribute(new First(new ParsedElmSelectors(elmSelector)), attrName, attrValue);
  }
};

var ActionByNameWithParams =
/*#__PURE__*/
function () {
  function ActionByNameWithParams(name) {
    _classCallCheck(this, ActionByNameWithParams);

    this.name = name;

    for (var _len7 = arguments.length, params = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      params[_key7 - 1] = arguments[_key7];
    }

    this.params = params;
  }

  _createClass(ActionByNameWithParams, [{
    key: "value",
    value: function value() {
      if (!actions[this.name]) {
        throw new Error("no such action with name \"".concat(this.name, "\""));
      }

      return actions[this.name].apply(actions, _toConsumableArray(this.params));
    }
  }]);

  return ActionByNameWithParams;
}();

module.exports = ActionByNameWithParams;
