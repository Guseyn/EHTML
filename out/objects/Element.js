'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

    element.applyValuesInAttributes = function (attrName, values) {
      _this.applyValuesInAttributes(element, attrName, values);
    };

    element.hasParamsInAttributesToApply = function (attrName) {
      return _this.hasParamsInAttributesToApply(element, attrName);
    };

    return element;
  }

  _createClass(Element, [{
    key: "applyStorageVariablesInAttributes",
    value: function applyStorageVariablesInAttributes(element) {
      var _this2 = this;

      for (var _len2 = arguments.length, attrNames = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        attrNames[_key2 - 1] = arguments[_key2];
      }

      attrNames.forEach(function (attrName) {
        var attr = element.getAttribute(attrName);

        if (attr) {
          element.setAttribute(attrName, _this2.attributeWithAppliedLocalStorageVariables(_this2.attributeWithAppliedMemoryStorageVariables(attr)));
        }
      });
    }
  }, {
    key: "applyValuesInAttributes",
    value: function applyValuesInAttributes(element, attrName, values) {
      var attr = element.getAttribute(attrName);
      element.setAttribute(attrName, attr.replace(paramRegExp, function (match, p1, offset, string) {
        try {
          // eslint-disable-next-line no-eval
          return eval("values.".concat(p1));
        } catch (e) {
          return match;
        }
      }));
    }
  }, {
    key: "hasParamsInAttributesToApply",
    value: function hasParamsInAttributesToApply(element, attrName) {
      return paramRegExp.test(element.getAttribute(attrName));
    }
  }, {
    key: "attributeWithAppliedLocalStorageVariables",
    value: function attributeWithAppliedLocalStorageVariables(attribute) {
      return attribute.replace(/\$\{localStorage\.(.+)\}/g, function (match, p1, offset, string) {
        return localStorage.getItem(p1);
      });
    }
  }, {
    key: "attributeWithAppliedMemoryStorageVariables",
    value: function attributeWithAppliedMemoryStorageVariables(attribute) {
      return attribute.replace(/\$\{memoryStorage\.(.+)\}/g, function (match, p1, offset, string) {
        // eslint-disable-next-line no-undef
        return memoryStorage.getItem(p1);
      });
    }
  }]);

  return Element;
}();

module.exports = Element;
