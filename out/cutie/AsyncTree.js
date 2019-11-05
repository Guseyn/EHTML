'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SimpleTreeNode = require('./SimpleTreeNode');

var AsyncTreeNode = require('./AsyncTreeNode');

var NotDefinedAsyncTreeNode = require('./NotDefinedAsyncTreeNode');

var AsyncTree =
/*#__PURE__*/
function () {
  /*
    rootField: AsyncObject
  */
  function AsyncTree(rootField) {
    _classCallCheck(this, AsyncTree);

    this.rootField = rootField;
    this.nodes = [];
  } // PUBLIC


  _createClass(AsyncTree, [{
    key: "create",
    value: function create() {
      this.createAsyncTreeNode(this.rootField, new NotDefinedAsyncTreeNode(), 0);
      return this;
    }
  }, {
    key: "call",
    value: function call() {
      var leaves = this.nodes.filter(function (node) {
        return node.isLeaf();
      });
      leaves.forEach(function (leaf) {
        leaf.call();
      });
    } // PRIVATE

  }, {
    key: "createChildNodes",
    value: function createChildNodes(field, parent) {
      var _this = this;

      field.iterateArgs(function (argAsField, index, isAsyncObject, isEvent) {
        if (isAsyncObject) {
          _this.createAsyncTreeNode(argAsField, parent, index);
        } else if (isEvent) {
          _this.createSimpleTreeNode(function () {
            argAsField.body.apply(argAsField, arguments);
          }, parent, index);
        } else {
          _this.createSimpleTreeNode(argAsField, parent, index);
        }
      });
    }
  }, {
    key: "createAsyncTreeNode",
    value: function createAsyncTreeNode(field, parent, index) {
      var asyncTreeNode = new AsyncTreeNode(field, parent, index);
      this.nodes.push(asyncTreeNode);
      this.createChildNodes(field, asyncTreeNode);
    }
  }, {
    key: "createSimpleTreeNode",
    value: function createSimpleTreeNode(field, parent, index) {
      var treeNode = new SimpleTreeNode(field, parent, index);
      this.nodes.push(treeNode);
    }
  }]);

  return AsyncTree;
}();

module.exports = AsyncTree;
