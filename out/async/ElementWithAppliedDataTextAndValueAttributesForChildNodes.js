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

var ParamWithAppliedValues = require('./../objects/ParamWithAppliedValues');

var ParamWithAppliedLocalStorage = require('./../objects/ParamWithAppliedLocalStorage');

var ParamWithAppliedMemoryStorage = require('./../objects/ParamWithAppliedMemoryStorage');

var ElementWithAppliedDataTextAndValueAttributesForChildNodes =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(ElementWithAppliedDataTextAndValueAttributesForChildNodes, _AsyncObject);

  function ElementWithAppliedDataTextAndValueAttributesForChildNodes(element, values) {
    _classCallCheck(this, ElementWithAppliedDataTextAndValueAttributesForChildNodes);

    return _possibleConstructorReturn(this, _getPrototypeOf(ElementWithAppliedDataTextAndValueAttributesForChildNodes).call(this, element, values));
  }

  _createClass(ElementWithAppliedDataTextAndValueAttributesForChildNodes, [{
    key: "syncCall",
    value: function syncCall() {
      var _this = this;

      return function (element, values) {
        var nameAttr = element.getAttribute('name');
        return _this.applyValuesToChildren(element, nameAttr ? _this.valuesWithNewKey(values, nameAttr) : values);
      };
    }
  }, {
    key: "applyValuesToChildren",
    value: function applyValuesToChildren(element, values) {
      var _this2 = this;

      element.childNodes.forEach(function (child) {
        if (child.getAttribute) {
          for (var i = 0; i < child.attributes.length; i++) {
            var attrName = child.attributes[i].name;

            _this2.applyStorageVariablesInAttributes(child, attrName);

            _this2.applyValuesInAttribute(child, attrName, values);

            if (attrName === 'data-text') {
              if (!_this2.hasParamsInAttributeToApply(child, 'data-text')) {
                _this2.insertTextIntoElm(child, child.getAttribute('data-text'));

                child.removeAttribute('data-text');
              }
            } else if (attrName === 'data-value') {
              if (!_this2.hasParamsInAttributeToApply(child, 'data-value')) {
                child.value = child.getAttribute('data-value');
                child.removeAttribute('data-value');
              }
            }
          }

          _this2.applyValuesToChildren(child, values);
        }
      });
      return element;
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
    key: "applyStorageVariablesInAttributes",
    value: function applyStorageVariablesInAttributes(element) {
      for (var _len = arguments.length, attrNames = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        attrNames[_key - 1] = arguments[_key];
      }

      attrNames.forEach(function (attrName) {
        var attr = element.getAttribute(attrName);

        if (attr) {
          element.setAttribute(attrName, new ParamWithAppliedLocalStorage(new ParamWithAppliedMemoryStorage(attr).value()).value());
        }
      });
    }
  }, {
    key: "applyValuesInAttribute",
    value: function applyValuesInAttribute(element, attrName, values) {
      var attr = element.getAttribute(attrName);
      element.setAttribute(attrName, new ParamWithAppliedValues(attr, values).value());
    }
  }, {
    key: "hasParamsInAttributeToApply",
    value: function hasParamsInAttributeToApply(element, attrName) {
      return /\$\{([^{}]+|\S*)\}/g.test(element.getAttribute(attrName));
    }
  }, {
    key: "valuesWithNewKey",
    value: function valuesWithNewKey(values, newKey) {
      var oldKey = Object.keys(values)[0];
      var newValues = {};
      newValues[newKey] = values[oldKey];
      return newValues;
    }
  }]);

  return ElementWithAppliedDataTextAndValueAttributesForChildNodes;
}(AsyncObject);

module.exports = ElementWithAppliedDataTextAndValueAttributesForChildNodes;
