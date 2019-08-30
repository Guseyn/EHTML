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

var EmptyAsyncObject = require('./../async/EmptyAsyncObject');

var BuiltAsyncTreeByParsedCommands = require('./../objects/BuiltAsyncTreeByParsedCommands');

var ParsedElmSelectors = require('./ParsedElmSelectors');

var ParamWithAppliedValues = require('./ParamWithAppliedValues');

var ParamWithAppliedLocalStorage = require('./ParamWithAppliedLocalStorage');

var ParamWithAppliedMemoryStorage = require('./ParamWithAppliedMemoryStorage');

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
    key: "asyncTree",
    value: function asyncTree(values) {
      var _this = this;

      // act1(p1, p2); act(q1, q2); ...
      if (!this.actionsCommand) {
        return new EmptyAsyncObject();
      }

      var commands = this.actionsCommand.split(';').map(function (command) {
        return command.trim();
      });
      var parsedCommands = [];
      commands.forEach(function (command) {
        var commandName = command.split('(')[0].trim();

        if (_this.supportedActions.indexOf(commandName) === -1) {
          throw new Error("command ".concat(commandName, " is not supported for the element ").concat(_this.tagName));
        }

        var commandParams = command.replace(')', '').split("".concat(commandName, "("))[1].split(',').map(function (param) {
          return param.trim();
        });

        switch (commandName) {
          case 'redirect':
            parsedCommands.push(_this.redirect(commandParams[0]));
            break;

          case 'saveToLocalStorage':
            parsedCommands.push(_this.saveToLocalStorage(commandParams[0], new ParamWithAppliedLocalStorage(new ParamWithAppliedMemoryStorage(new ParamWithAppliedValues(commandParams[1], values))).value()));
            break;

          case 'saveToMemoryStorage':
            parsedCommands.push(_this.saveToMemoryStorage(commandParams[0], new ParamWithAppliedLocalStorage(new ParamWithAppliedMemoryStorage(new ParamWithAppliedValues(commandParams[1], values).value()).value()).value()));
            break;

          case 'innerHTML':
            parsedCommands.push(_this.innerHTML(commandParams[0], new ParamWithAppliedLocalStorage(new ParamWithAppliedMemoryStorage(new ParamWithAppliedValues(commandParams[1], values).value()).value()).value(), new ParamWithAppliedLocalStorage(new ParamWithAppliedMemoryStorage(new ParamWithAppliedValues(commandParams[2], values).value()).value()).value()));
            break;

          case 'applyTextsAndValuesToChildNodes':
            parsedCommands.push(_this.applyTextsAndValuesToChildNodes(commandParams[0], values));
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
      return new BuiltAsyncTreeByParsedCommands(parsedCommands).value();
    } // ACTIONS

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
      for (var _len = arguments.length, elmSelectors = new Array(_len), _key = 0; _key < _len; _key++) {
        elmSelectors[_key] = arguments[_key];
      }

      return _construct(HiddenElements, _toConsumableArray(_construct(ParsedElmSelectors, elmSelectors).value()));
    }
  }, {
    key: "showElms",
    value: function showElms() {
      for (var _len2 = arguments.length, elmSelectors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        elmSelectors[_key2] = arguments[_key2];
      }

      return _construct(ShownElements, _toConsumableArray(_construct(ParsedElmSelectors, elmSelectors).value()));
    }
  }, {
    key: "disableElms",
    value: function disableElms() {
      for (var _len3 = arguments.length, elmSelectors = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        elmSelectors[_key3] = arguments[_key3];
      }

      return _construct(DisabledElements, _toConsumableArray(_construct(ParsedElmSelectors, elmSelectors).value()));
    }
  }, {
    key: "enableElms",
    value: function enableElms() {
      for (var _len4 = arguments.length, elmSelectors = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        elmSelectors[_key4] = arguments[_key4];
      }

      return _construct(EnabledElements, _toConsumableArray(_construct(ParsedElmSelectors, elmSelectors).value()));
    }
  }, {
    key: "innerHTML",
    value: function innerHTML(elmSelector, url, headers) {
      return new ElementWithInnerHTML(new ParsedElmSelectors(elmSelector).value()[0], new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', this.getAttribute(url), 'method', 'GET', 'headers', new ParsedJSON(headers || '{}')))));
    }
  }, {
    key: "applyTextsAndValuesToChildNodes",
    value: function applyTextsAndValuesToChildNodes(elmSelector, values) {
      return new ElementWithAppliedDataTextAndValueAttributesForChildNodes(new ParsedElmSelectors(elmSelector).value()[0], values);
    }
  }, {
    key: "changeElmsClassName",
    value: function changeElmsClassName(newClassName) {
      for (var _len5 = arguments.length, elmSelectors = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        elmSelectors[_key5 - 1] = arguments[_key5];
      }

      return _construct(ElementsWithChangedClass, [newClassName].concat(_toConsumableArray(_construct(ParsedElmSelectors, elmSelectors).value())));
    }
  }]);

  return Actions;
}();

module.exports = Actions;
