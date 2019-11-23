'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var ActionByNameWithParams = require('./ActionByNameWithParams');

var ParsedActions =
/*#__PURE__*/
function () {
  function ParsedActions(actions, tagName, resObj, resName) {
    _classCallCheck(this, ParsedActions);

    // act1(p1, p2); act(q1, q2); ...
    this.actions = actions;
    this.tagName = tagName;
    this.resObj = resObj;
    this.resName = resName;
  }

  _createClass(ParsedActions, [{
    key: "value",
    value: function value() {
      var _this = this;

      var parsedActions = {};

      if (!this.actions) {
        return {
          length: 0
        };
      }

      var splittedActions = this.actions.split(';').map(function (action) {
        return action.trim();
      }).filter(function (action) {
        return action.length !== 0;
      });
      splittedActions.forEach(function (action, index) {
        var executedIfStatement = /if([\s]+)?(\(.+\))([\s]+)/.exec(action);
        var ifStatement;

        if (executedIfStatement) {
          ifStatement = executedIfStatement[0];
          action = action.replace(ifStatement, '');
        }

        var actionName = _this.expressionName(action);

        var actionParams = _this.expressionParams(action, actionName);

        var parsedAction;

        if (ifStatement) {
          var ifStatementName = _this.expressionName(ifStatement);

          var ifStatementParam = _this.expressionParams(ifStatement, ifStatementName)[0];

          parsedAction = new ActionByNameWithParams(ifStatementName, ifStatementParam, _construct(ActionByNameWithParams, [actionName].concat(_toConsumableArray(actionParams))).value()).value();
        } else {
          parsedAction = _construct(ActionByNameWithParams, [actionName].concat(_toConsumableArray(actionParams))).value();
        }

        parsedActions[index] = parsedAction;
      });
      parsedActions.length = splittedActions.length;
      return parsedActions;
    }
  }, {
    key: "expressionName",
    value: function expressionName(action) {
      return action.split('(')[0].trim();
    }
  }, {
    key: "expressionParams",
    value: function expressionParams(action, actionName) {
      var params = action.split(actionName)[1]; // eslint-disable-next-line no-eval

      return eval("this.funcWithParams".concat(params));
    }
  }, {
    key: "funcWithParams",
    value: function funcWithParams() {
      var _this2 = this;

      for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      return params.map(function (param) {
        return _this2.evaluatedParam(param, _this2.resObj, _this2.resName);
      });
    }
  }, {
    key: "evaluatedParam",
    value: function evaluatedParam(param, resObj, resName) {
      if (typeof param === 'string') {
        if (!/\$\{([^${}]+)\}/g.test(param)) {
          return param;
        }

        return param.replace(/\$\{([^${}]+)\}/g, function (match, p1) {
          // eslint-disable-next-line no-eval
          return eval("\n          const ".concat(resName, " = resObj\n          ").concat(match.replace(/^\$\{([^${}]+)\}$/g, function (match, p1) {
            return p1;
          }), "\n        "));
        });
      }

      if (_typeof(param) === 'object') {
        for (var key in param) {
          param[key] = this.evaluatedParam(param[key], resObj, resName);
        }

        return param;
      }

      return param;
    }
  }]);

  return ParsedActions;
}();

module.exports = ParsedActions;
