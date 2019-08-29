'use strict';

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('@page-libs/cutie'),
    browserified = _require.browserified;

var _browserified = browserified(require('@cuties/object')),
    CreatedOptions = _browserified.CreatedOptions;

var _browserified2 = browserified(require('@cuties/json')),
    ParsedJSON = _browserified2.ParsedJSON;

var _require2 = require('@page-libs/ajax'),
    ResponseFromAjaxRequest = _require2.ResponseFromAjaxRequest,
    ResponseBody = _require2.ResponseBody;

var _require3 = require('@page-libs/dom'),
    ElementWithInnerHTML = _require3.ElementWithInnerHTML;

var RedirectAction = require('./../async/RedirectAction');

var LocalStorageWithSetValue = require('./../async/LocalStorageWithSetValue');

var MemoryStorageWithSetValue = require('./../async/MemoryStorageWithSetValue');

var HiddenElements = require('./../async/HiddenElements');

var ShownElements = require('./../async/ShownElements');

var DisabledElements = require('./../async/DisabledElements');

var EnabledElements = require('./../async/EnabledElements');

var ElementWithAppliedDataTextAndValueAttributesForChildNodes = require('./../async/ElementWithAppliedDataTextAndValueAttributesForChildNodes');

var ElementsWithChangedClass = require('./../async/ElementsWithChangedClass');

var paramRegExp = /\$\{(\S*)\}/g;

var Actions =
/*#__PURE__*/
function () {
  function Actions(tagName, actionsCommand, supportedActions) {
    _classCallCheck(this, Actions);

    this.tagName = tagName;
    this.actionsCommand = actionsCommand;
    this.supportedActions = supportedActions;
  } // PUBLIC


  _createClass(Actions, [{
    key: "run",
    value: function run(values) {} // ACTIONS

  }, {
    key: "redirect",
    value: function redirect(url) {
      return new RedirectAction(url);
    }
  }, {
    key: "saveToLocalStorage",
    value: function saveToLocalStorage(key, value) {
      return new LocalStorageWithSetValue(key, value);
    }
  }, {
    key: "saveToMemoryStorage",
    value: function saveToMemoryStorage(key, value) {
      return new MemoryStorageWithSetValue(key, value);
    }
  }, {
    key: "hideElms",
    value: function hideElms() {
      return _construct(HiddenElements, _toConsumableArray(this.parseElmSelectors.apply(this, arguments)));
    }
  }, {
    key: "showElms",
    value: function showElms() {
      return _construct(ShownElements, _toConsumableArray(this.parseElmSelectors.apply(this, arguments)));
    }
  }, {
    key: "disableElms",
    value: function disableElms() {
      return _construct(DisabledElements, _toConsumableArray(this.parseElmSelectors.apply(this, arguments)));
    }
  }, {
    key: "enableElms",
    value: function enableElms() {
      return _construct(EnabledElements, _toConsumableArray(this.parseElmSelectors.apply(this, arguments)));
    }
  }, {
    key: "innerHTML",
    value: function innerHTML(elmSelector, url, headers) {
      return new ElementWithInnerHTML(this.parseElmSelectors(elmSelector)[0], new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', this.getAttribute(url), 'method', 'GET', 'headers', new ParsedJSON(headers || '{}')))));
    }
  }, {
    key: "applyTextsAndValuesToChildNodes",
    value: function applyTextsAndValuesToChildNodes(elmSelector, values) {
      return new ElementWithAppliedDataTextAndValueAttributesForChildNodes(this.parseElmSelectors(elmSelector)[0], values);
    }
  }, {
    key: "changeElmsClassName",
    value: function changeElmsClassName(newClassName) {
      for (var _len = arguments.length, elmSelectors = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        elmSelectors[_key - 1] = arguments[_key];
      }

      return _construct(ElementsWithChangedClass, _toConsumableArray(this.parseElmSelectors.apply(this, elmSelectors)));
    } // PRIVATE

  }, {
    key: "parseElmSelectors",
    value: function parseElmSelectors() {
      var _this = this;

      var elms = [];

      for (var _len2 = arguments.length, elmSelectors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        elmSelectors[_key2] = arguments[_key2];
      }

      elmSelectors.forEach(function (elmSelector) {
        if (new RegExp(/^#(\S+)$/g).test(elmSelector)) {
          elms.push(document.getElementById(elmSelector.split('#')[1]));
        } else if (new RegExp(/^\.(\S+)$/g).test(elmSelector)) {
          _this.pushElms(elms, document.getElementsByClassName(elmSelector.split('.')[1]));
        } else if (new RegExp(/^(\S+)$/g).test(elmSelector)) {
          _this.pushElms(elms, document.getElementsByTagName(elmSelector));
        }
      });
      return elms;
    }
  }, {
    key: "pushElms",
    value: function pushElms(elms, elmsToPush) {
      for (var i = 0; i < elmsToPush.length; i++) {
        elms.push(elmsToPush[i]);
      }
    }
  }, {
    key: "parseCommands",
    value: function parseCommands(values) {
      var _this2 = this;

      // act1(p1, p2); act(q1, q2); ...
      var commands = this.actionsCommand.split(';').map(function (command) {
        return command.trim();
      });
      commands.forEach(function (command) {
        if (_this2.supportedActions.indexOf(command) === -1) {
          throw new Error("".concat(command, " is not supported for the element ").concat(_this2.tagName));
        } // const commandName = command.split('(')[0].trim()
        // TODO
        // const commandParams =

      });
    }
  }, {
    key: "runCommand",
    value: function runCommand() {}
  }, {
    key: "applyValuesToParam",
    value: function applyValuesToParam(param, values) {
      param.replace(paramRegExp, function (match, p1, offset, string) {
        try {
          // eslint-disable-next-line no-eval
          return eval("values.".concat(p1));
        } catch (e) {
          return match;
        }
      });
    }
  }]);

  return Actions;
}();

module.exports = Actions;
