'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var E = require('./E');

var E_IF =
/*#__PURE__*/
function (_E) {
  _inherits(E_IF, _E);

  function E_IF(node) {
    _classCallCheck(this, E_IF);

    return _possibleConstructorReturn(this, _getPrototypeOf(E_IF).call(this, node));
  }

  _createClass(E_IF, [{
    key: "activate",
    value: function activate() {
      var toDisplayExpression = this.node.getAttribute('data-condition-to-display');

      if (!toDisplayExpression) {
        throw new Error('e-if must have "data-condition-to-display" attribute');
      }

      var toDisplay = this.appliedExpressionsInString(toDisplayExpression);

      if (toDisplay === 'true') {
        var contentNode = document.importNode(this.node.content, true);
        this.node.parentNode.insertBefore(contentNode, this.node);
      }

      this.node.parentNode.removeChild(this.node);
    }
  }, {
    key: "appliedExpressionsInString",
    value: function appliedExpressionsInString(string) {
      return string.replace(/\$\{([^${}]+)\}/g, function (match, p1) {
        // eslint-disable-next-line no-eval
        var appliedExpression = eval(p1);

        if (_typeof(appliedExpression) === 'object') {
          return JSON.stringify(appliedExpression);
        }

        return appliedExpression;
      });
    }
  }]);

  return E_IF;
}(E);

module.exports = E_IF;
