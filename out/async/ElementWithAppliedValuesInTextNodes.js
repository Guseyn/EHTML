"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require('@page-libs/cutie'),
    AsyncObject = _require.AsyncObject;

var ElementWithAppliedValuesInTextNodes =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(ElementWithAppliedValuesInTextNodes, _AsyncObject);

  function ElementWithAppliedValuesInTextNodes(element, values) {
    _classCallCheck(this, ElementWithAppliedValuesInTextNodes);

    return _possibleConstructorReturn(this, _getPrototypeOf(ElementWithAppliedValuesInTextNodes).call(this, element, values));
  }

  _createClass(ElementWithAppliedValuesInTextNodes, [{
    key: "syncCall",
    value: function syncCall() {
      var _this = this;

      return function (element, values) {
        return _this.applyValuesToChildren(element, values);
      };
    }
  }, {
    key: "applyValuesToChildren",
    value: function applyValuesToChildren(element, values) {
      var _this2 = this;

      element.childNodes.forEach(function (child) {
        if (child.nodeType === Node.TEXT_NODE) {
          child.nodeValue = child.nodeValue.replace(/\$\{(.+)\.(.+)\}/g, function (match, p1, p2, offset, string) {
            return values[p1] ? values[p1][p2] : "${".concat(p1, ".").concat(p2, "}");
          });
        } else {
          _this2.applyValuesToChildren(child, values);
        }
      });
      return element;
    }
  }]);

  return ElementWithAppliedValuesInTextNodes;
}(AsyncObject);

module.exports = ElementWithAppliedValuesInTextNodes;
