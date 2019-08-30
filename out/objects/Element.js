'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ParamWithAppliedValues = require('./ParamWithAppliedValues');

var ParamWithAppliedLocalStorage = require('./ParamWithAppliedLocalStorage');

var ParamWithAppliedMemoryStorage = require('./ParamWithAppliedMemoryStorage');

var paramRegExp = /\$\{([^{}]+|\S*)\}/g;

var ParamWithAppliedValues2 =
/*#__PURE__*/
function () {
  function ParamWithAppliedValues2(param, values) {
    _classCallCheck(this, ParamWithAppliedValues2);

    this.param = param;
    this.values = values;
  }

  _createClass(ParamWithAppliedValues2, [{
    key: "value",
    value: function value() {
      var _this = this;

      return this.param.replace(paramRegExp, function (match, p1, offset, string) {
        try {
          return _this.valueOf(_this.values, p1.split('.'));
        } catch (e) {
          return match;
        }
      });
    }
  }, {
    key: "valueOf",
    value: function valueOf(values, pathParts) {
      var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      if (pathParts.length === 0) {
        return '';
      }

      if (pathParts.length - 1 === index) {
        return values[pathParts[index]];
      } else {
        return this.valueOf(values[pathParts[index]], pathParts, index + 1);
      }
    }
  }]);

  return ParamWithAppliedValues2;
}();

var Element =
/*#__PURE__*/
function () {
  function Element(element) {
    var _this2 = this;

    _classCallCheck(this, Element);

    element.applyStorageVariablesInAttributes = function () {
      for (var _len = arguments.length, attrNames = new Array(_len), _key = 0; _key < _len; _key++) {
        attrNames[_key] = arguments[_key];
      }

      _this2.applyStorageVariablesInAttributes.apply(_this2, [element].concat(attrNames));
    };

    element.applyValuesInAttribute = function (attrName, values) {
      _this2.applyValuesInAttribute(element, attrName, values);
    };

    element.hasParamsInAttributeToApply = function (attrName) {
      return _this2.hasParamsInAttributeToApply(element, attrName);
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
      element.setAttribute(attrName, new ParamWithAppliedValues2(attr, values).value());
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
