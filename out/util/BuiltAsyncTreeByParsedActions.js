'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EmptyAsyncObject = require('./../async/EmptyAsyncObject');

var BuiltAsyncTreeByParsedActions =
/*#__PURE__*/
function () {
  function BuiltAsyncTreeByParsedActions(parsedActions) {
    _classCallCheck(this, BuiltAsyncTreeByParsedActions);

    this.parsedActions = parsedActions;
  }

  _createClass(BuiltAsyncTreeByParsedActions, [{
    key: "value",
    value: function value() {
      var keys = Object.keys(this.parsedActions);
      var length = keys.length;
      var index = 0;

      if (length === 0) {
        return new EmptyAsyncObject();
      }

      return this.buildAsyncTree(index, length, keys);
    }
  }, {
    key: "buildAsyncTree",
    value: function buildAsyncTree(curIndex, length, keys) {
      if (length === curIndex) {
        return this.parsedActions[keys[0]];
      } else {
        this.getLastNext(this.parsedActions[keys[curIndex]]).after(this.parsedActions[keys[curIndex + 1]]);
        return this.buildAsyncTree(curIndex + 1, length, keys);
      }
    }
  }, {
    key: "getLastNext",
    value: function getLastNext(parsedAction) {
      if (parsedAction.next) {
        return this.getLastNext(parsedAction.next);
      }

      return parsedAction;
    }
  }]);

  return BuiltAsyncTreeByParsedActions;
}();

module.exports = BuiltAsyncTreeByParsedActions;
