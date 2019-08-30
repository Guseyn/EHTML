'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ParamWithAppliedValues = require('./../objects/ParamWithAppliedValues');

var ParamWithAppliedLocalStorage = require('./../objects/ParamWithAppliedLocalStorage');

var ParamWithAppliedMemoryStorage = require('./../objects/ParamWithAppliedMemoryStorage');

var paramRegExp = /\$\{([^{}]+|\S*)\}/g;

var Element =
/*#__PURE__*/
function () {
  function Element(element) {
    var _this = this;

    _classCallCheck(this, Element);

    element.applyStorageVariablesInAttributes = function () {
      for (var _len = arguments.length, attrNames = new Array(_len), _key = 0; _key < _len; _key++) {
        attrNames[_key] = arguments[_key];
      }

      _this.applyStorageVariablesInAttributes.apply(_this, [element].concat(attrNames));
    };

    element.applyValuesInAttribute = function (attrName, values) {
      _this.applyValuesInAttribute(element, attrName, values);
    };

    element.hasParamsInAttributeToApply = function (attrName) {
      return _this.hasParamsInAttributeToApply(element, attrName);
    };

    return element;
  }

  _createClass(Element, [{
    key: "applyStorageVariablesInAttributes",
    value: function applyStorageVariablesInAttributes(element) {
      for (var _len2 = arguments.length, attrNames = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        attrNames[_key2 - 1] = arguments[_key2];
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
      return paramRegExp.test(element.getAttribute(attrName));
    }
  }]);

  return Element;
}();

module.exports = Element;
