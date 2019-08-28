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

var _require = require('@page-libs/cutie'),
    AsyncObject = _require.AsyncObject;

var Elements = require('./../objects/Elements');

var paramRegExp = /\$\{(\S*)\}/g;

var ElementsWithAppliedDataTextAndValueAttributesForChildNodes =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(ElementsWithAppliedDataTextAndValueAttributesForChildNodes, _AsyncObject);

  function ElementsWithAppliedDataTextAndValueAttributesForChildNodes(values) {
    var _getPrototypeOf2;

    _classCallCheck(this, ElementsWithAppliedDataTextAndValueAttributesForChildNodes);

    for (var _len = arguments.length, elements = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      elements[_key - 1] = arguments[_key];
    }

    return _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ElementsWithAppliedDataTextAndValueAttributesForChildNodes)).call.apply(_getPrototypeOf2, [this, values].concat(elements)));
  }

  _createClass(ElementsWithAppliedDataTextAndValueAttributesForChildNodes, [{
    key: "syncCall",
    value: function syncCall() {
      var _this = this;

      return function (values) {
        for (var _len2 = arguments.length, elements = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          elements[_key2 - 1] = arguments[_key2];
        }

        return _this.applyValuesToChildren.apply(_this, [values].concat(elements));
      };
    }
  }, {
    key: "applyValuesToChildren",
    value: function applyValuesToChildren(values) {
      var _this2 = this;

      for (var _len3 = arguments.length, elements = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        elements[_key3 - 1] = arguments[_key3];
      }

      elements.forEach(function (element) {
        element.childNodes.forEach(function (child) {
          if (child.getAttribute) {
            new Elements(child).applyStorageVariablesInAttributes('data-text', 'data-value');

            if (child.getAttribute('data-text')) {
              _this2.updateAttribute(child, 'data-text', values);

              if (_this2.readyToBeApplied(child, 'data-text')) {
                _this2.insertTextIntoElm(child, child.getAttribute('data-text'));

                child.removeAttribute('data-text');
              }
            } else if (child.getAttribute('data-value')) {
              _this2.updateAttribute(child, 'data-value', values);

              if (_this2.readyToBeApplied(child, 'data-value')) {
                child.value = child.getAttribute('data-value');
                child.removeAttribute('data-value');
              }
            }

            _this2.applyValuesToChildren(values, child);
          }
        });
      });
      return elements;
    }
  }, {
    key: "updateAttribute",
    value: function updateAttribute(element, attrName, values) {
      element.setAttribute(attrName, element.getAttribute(attrName).replace(paramRegExp, function (match, p1, offset, string) {
        try {
          // eslint-disable-next-line no-eval
          return eval("values.".concat(p1));
        } catch (e) {
          return match;
        }
      }));
    }
  }, {
    key: "insertTextIntoElm",
    value: function insertTextIntoElm(elm, text) {
      var textNode = document.createTextNode(text);

      if (elm.childNodes.length === 0) {
        elm.appendChild(textNode);
      } else {
        elm.insertBefore(textNode, elm.childNodes[0]);
      }
    }
  }, {
    key: "readyToBeApplied",
    value: function readyToBeApplied(child, attrName) {
      return !paramRegExp.test(child.getAttribute(attrName));
    }
  }]);

  return ElementsWithAppliedDataTextAndValueAttributesForChildNodes;
}(AsyncObject);

module.exports = ElementsWithAppliedDataTextAndValueAttributesForChildNodes;
