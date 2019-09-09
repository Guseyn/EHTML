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

var _require2 = require('@page-libs/ajax'),
    ResponseFromAjaxRequest = _require2.ResponseFromAjaxRequest,
    ResponseBody = _require2.ResponseBody;

var _require3 = require('@page-libs/dom'),
    ElementWithInnerHTML = _require3.ElementWithInnerHTML,
    ElementWithAdditionalHTML = _require3.ElementWithAdditionalHTML;

var RedirectAction = require('./../async/RedirectAction');

var LocalStorageWithSetValue = require('./../async/LocalStorageWithSetValue');

var MemoryStorageWithSetValue = require('./../async/MemoryStorageWithSetValue');

var HiddenElements = require('./../async/HiddenElements');

var ShownElements = require('./../async/ShownElements');

var DisabledElements = require('./../async/DisabledElements');

var EnabledElements = require('./../async/EnabledElements');

var ElementWithAppliedValuesToChildNodes = require('./../async/ElementWithAppliedValuesToChildNodes');

var ElementsWithChangedClass = require('./../async/ElementsWithChangedClass');

var EmptyAsyncObject = require('./../async/EmptyAsyncObject');

var BuiltAsyncTreeByParsedCommands = require('./../objects/BuiltAsyncTreeByParsedCommands');

var FirstOf = require('./../async/FirstOf');

var ParsedElmSelectors = require('./../async/ParsedElmSelectors');

var ParamWithAppliedValues = require('./../async/ParamWithAppliedValues');

var ParamWithAppliedLocalStorage = require('./../async/ParamWithAppliedLocalStorage');

var ParamWithAppliedMemoryStorage = require('./../async/ParamWithAppliedMemoryStorage');

var ParsedJSONOrString = require('./../async/ParsedJSONOrString');

var Actions =
/*#__PURE__*/
function () {
  function Actions(tagName, actionsCommand, supportedActions) {
    _classCallCheck(this, Actions);

    this.tagName = tagName;
    this.actionsCommand = actionsCommand;
    this.supportedActions = supportedActions;
  }

  _createClass(Actions, [{
    key: "asyncTree",
    value: function asyncTree(values) {
      var _this = this;

      // act1(p1, p2); act(q1, q2); ...
      if (!this.actionsCommand) {
        return new EmptyAsyncObject(values);
      }

      var commands = this.actionsCommand.split(';').map(function (command) {
        return command.trim();
      }).filter(function (command) {
        return command.length !== 0;
      });
      var parsedCommands = [];
      commands.forEach(function (command) {
        var commandName = command.split('(')[0].trim();

        if (_this.supportedActions.indexOf(commandName) === -1) {
          throw new Error("command ".concat(commandName, " is not supported for the element ").concat(_this.tagName));
        } // APPLY VARS: here we just apply storage vars and values to the action attributes


        var commandParams = command.replace(')', '').split("".concat(commandName, "("))[1].split(',').map(function (param) {
          return new ParsedJSONOrString(new ParamWithAppliedLocalStorage(new ParamWithAppliedMemoryStorage(new ParamWithAppliedValues(param, values, '1'))));
        });

        switch (commandName) {
          case 'redirect':
            parsedCommands.push(_this.redirect(commandParams[0]));
            break;

          case 'saveToLocalStorage':
            parsedCommands.push(_this.saveToLocalStorage(commandParams[0], commandParams[1]));
            break;

          case 'saveToMemoryStorage':
            parsedCommands.push(_this.saveToMemoryStorage(commandParams[0], commandParams[1]));
            break;

          case 'innerHTML':
            parsedCommands.push(_this.innerHTML(commandParams[0], commandParams[1], commandParams[2]));
            break;

          case 'addHTMLTo':
            parsedCommands.push(_this.addHTMLTo(commandParams[0], commandParams[1], commandParams[2]));
            break;

          case 'applyValuesToChildNodes':
            parsedCommands.push(_this.applyValuesToChildNodes(commandParams[0], commandParams[1]));
            break;

          case 'hideElms':
          case 'showElms':
          case 'disableElms':
          case 'enableElms':
          case 'changeElmsClassName':
            parsedCommands.push(_this[commandName].apply(_this, _toConsumableArray(commandParams)));
            break;

          default:
            throw new Error("command ".concat(command, " does not exists"));
        }
      });
      return new BuiltAsyncTreeByParsedCommands(parsedCommands, values).value();
    } // ACTIONS

  }, {
    key: "redirect",
    value: function redirect(url) {
      return new RedirectAction(url);
    }
  }, {
    key: "saveToLocalStorage",
    value: function saveToLocalStorage(key, value) {
      return new LocalStorageWithSetValue(localStorage, key, value);
    }
  }, {
    key: "saveToMemoryStorage",
    value: function saveToMemoryStorage(key, value) {
      // eslint-disable-next-line no-undef
      return new MemoryStorageWithSetValue(memoryStorage, key, value);
    }
  }, {
    key: "hideElms",
    value: function hideElms() {
      for (var _len = arguments.length, elmSelectors = new Array(_len), _key = 0; _key < _len; _key++) {
        elmSelectors[_key] = arguments[_key];
      }

      return new HiddenElements(_construct(ParsedElmSelectors, elmSelectors));
    }
  }, {
    key: "showElms",
    value: function showElms() {
      for (var _len2 = arguments.length, elmSelectors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        elmSelectors[_key2] = arguments[_key2];
      }

      return new ShownElements(_construct(ParsedElmSelectors, elmSelectors));
    }
  }, {
    key: "disableElms",
    value: function disableElms() {
      for (var _len3 = arguments.length, elmSelectors = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        elmSelectors[_key3] = arguments[_key3];
      }

      return new DisabledElements(_construct(ParsedElmSelectors, elmSelectors));
    }
  }, {
    key: "enableElms",
    value: function enableElms() {
      for (var _len4 = arguments.length, elmSelectors = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        elmSelectors[_key4] = arguments[_key4];
      }

      return new EnabledElements(_construct(ParsedElmSelectors, elmSelectors));
    }
  }, {
    key: "innerHTML",
    value: function innerHTML(elmSelector, url, headers) {
      return new ElementWithInnerHTML(new FirstOf(new ParsedElmSelectors(elmSelector)), new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', url, 'method', 'GET', 'headers', new ParsedJSONOrString(headers || '{}')))));
    }
  }, {
    key: "addHTMLTo",
    value: function addHTMLTo(elmSelector, url, headers) {
      return new ElementWithAdditionalHTML(new FirstOf(new ParsedElmSelectors(elmSelector)), new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', url, 'method', 'GET', 'headers', new ParsedJSONOrString(headers || '{}')))));
    }
  }, {
    key: "applyValuesToChildNodes",
    value: function applyValuesToChildNodes(elmSelector, values) {
      return new ElementWithAppliedValuesToChildNodes(new FirstOf(new ParsedElmSelectors(elmSelector)), values);
    }
  }, {
    key: "changeElmsClassName",
    value: function changeElmsClassName(newClassName) {
      for (var _len5 = arguments.length, elmSelectors = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        elmSelectors[_key5 - 1] = arguments[_key5];
      }

      return new ElementsWithChangedClass(newClassName, _construct(ParsedElmSelectors, elmSelectors));
    }
  }]);

  return Actions;
}();

module.exports = Actions;
