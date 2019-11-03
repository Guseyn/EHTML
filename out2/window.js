'use strict';

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require('./actions/exports'),
    ActionByNameWithParams = _require.ActionByNameWithParams;

window.eMappedRegExps = {};

if (!window.customElements) {
  window.stop();
  throw new Error('Your browser does not support custom elements so you cannot use EHTML as it\'s based on them.');
}

if (!sessionStorage.getItem('isFirstStatePushedToHistory')) {
  sessionStorage.setItem('isFirstStatePushedToHistory', 'false');
}

var retrievedValue = function retrievedValue(target, value) {
  if (value instanceof Function) {
    return value(target);
  }

  return value;
};

window.onpopstate = function (event) {
  if (event.state) {
    document.body.innerHTML = event.state.body;
    document.title = event.state.title;

    if (event.state.favicon) {
      var oldLink = document.querySelector("link[rel*='icon']");
      var newLink = document.createElement('link');
      newLink.type = 'image/x-icon';
      newLink.rel = 'shortcut icon';
      newLink.href = event.state.favicon;

      if (oldLink) {
        document.head.removeChild(oldLink);
      }

      document.head.appendChild(newLink);
    }
  }
};

window.onbeforeunload = function () {
  sessionStorage.removeItem('isFirstStatePushedToHistory');
};

window.redirect = function (target, url) {
  new ActionByNameWithParams('redirect', retrievedValue(target, url)).value().call();
};

window.saveToLocalStorage = function (target, key, value) {
  new ActionByNameWithParams('saveToLocalStorage', retrievedValue(target, key), retrievedValue(target, value)).value().call();
};

window.saveToSessionStorage = function (target, key, value) {
  new ActionByNameWithParams('saveToSessionStorage', retrievedValue(target, key), retrievedValue(target, value)).value().call();
};

window.hideElms = function () {
  for (var _len = arguments.length, elmSelectors = new Array(_len), _key = 0; _key < _len; _key++) {
    elmSelectors[_key] = arguments[_key];
  }

  _construct(ActionByNameWithParams, ['hideElms'].concat(elmSelectors)).value().call();
};

window.showElms = function () {
  for (var _len2 = arguments.length, elmSelectors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    elmSelectors[_key2] = arguments[_key2];
  }

  _construct(ActionByNameWithParams, ['showElms'].concat(elmSelectors)).value().call();
};

window.disableElms = function () {
  for (var _len3 = arguments.length, elmSelectors = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    elmSelectors[_key3] = arguments[_key3];
  }

  _construct(ActionByNameWithParams, ['disableElms'].concat(elmSelectors)).value().call();
};

window.enableElms = function () {
  for (var _len4 = arguments.length, elmSelectors = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    elmSelectors[_key4] = arguments[_key4];
  }

  _construct(ActionByNameWithParams, ['enableElms'].concat(elmSelectors)).value().call();
};

window.innerHTML = function (target, elm, url, headers) {
  new ActionByNameWithParams('innerHTML', retrievedValue(target, elm), retrievedValue(target, url), retrievedValue(target, headers)).value().call();
};

window.addHTMLTo = function (target, elm, url, headers) {
  new ActionByNameWithParams('addHTMLTo', retrievedValue(target, elm), retrievedValue(target, url), retrievedValue(target, headers)).value().call();
};

window.textContent = function (target, elm, url, headers) {
  new ActionByNameWithParams('textContent', retrievedValue(target, elm), retrievedValue(target, url), retrievedValue(target, headers)).value().call();
};

window.changeValueOf = function (target, elmSelector, newValue) {
  new ActionByNameWithParams('changeValueOf', elmSelector, retrievedValue(target, newValue)).value().call();
};

window.mapObjToElm = function (target, obj, elmSelector) {
  new ActionByNameWithParams('mapObjToElm', retrievedValue(target, obj), elmSelector).value().call();
};

window.toggleElms = function (className) {
  for (var _len5 = arguments.length, elmSelectors = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    elmSelectors[_key5 - 1] = arguments[_key5];
  }

  _construct(ActionByNameWithParams, ['toggleElms', className].concat(elmSelectors)).value().call();
};

window.turboRedirect = function (target, href, headers, ajaxFavicon) {
  new ActionByNameWithParams('turboRedirect', retrievedValue(target, href), retrievedValue(target, headers), retrievedValue(target, ajaxFavicon)).value().call();
};
