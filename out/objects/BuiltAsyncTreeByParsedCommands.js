'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EmptyAsyncObject = require('./../async/EmptyAsyncObject');

var BuiltAsyncTreeByParsedCommands =
/*#__PURE__*/
function () {
  function BuiltAsyncTreeByParsedCommands(parsedCommands) {
    _classCallCheck(this, BuiltAsyncTreeByParsedCommands);

    this.parsedCommands = parsedCommands;
  }

  _createClass(BuiltAsyncTreeByParsedCommands, [{
    key: "value",
    value: function value() {
      return this.buildAsyncTree();
    }
  }, {
    key: "buildAsyncTree",
    value: function buildAsyncTree() {
      var curIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var tree = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.parsedCommands[0];

      if (this.parsedCommands.length === 0) {
        return new EmptyAsyncObject();
      }

      var curCommand = this.parsedCommands[curIndex];

      if (this.parsedCommands.length === curIndex) {
        return tree;
      } else {
        tree.after(curCommand);
        return this.buildAsyncTree(this.parsedCommands, curIndex + 1, tree);
      }
    }
  }]);

  return BuiltAsyncTreeByParsedCommands;
}();

module.exports = BuiltAsyncTreeByParsedCommands;
