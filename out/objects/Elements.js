'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var paramRegExp = /\$\{(\S*)\}/g;

var Elements =
/*#__PURE__*/
function () {
  function Elements() {
    _classCallCheck(this, Elements);

    for (var _len = arguments.length, elements = new Array(_len), _key = 0; _key < _len; _key++) {
      elements[_key] = arguments[_key];
    }

    this.elements = elements;
  }

  _createClass(Elements, [{
    key: "withAppliedStorageVariablesInAttributes",
    value: function withAppliedStorageVariablesInAttributes() {
      var _this = this;

      for (var _len2 = arguments.length, attrNames = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        attrNames[_key2] = arguments[_key2];
      }

      this.elements.forEach(function (element) {
        attrNames.forEach(function (attrName) {
          var attr = element.getAttribute(attrName);

          if (attr) {
            element.setAttribute(attrName, _this.attributeWithAppliedLocalStorageVariables(_this.attributeWithAppliedMemoryStorageVariables(attr)));
          }
        });
      });
      return this;
    }
  }, {
    key: "withAppliedObjectValuesInAttributes",
    value: function withAppliedObjectValuesInAttributes(values) {
      for (var _len3 = arguments.length, attrNames = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        attrNames[_key3 - 1] = arguments[_key3];
      }

      this.elements.forEach(function (element) {
        attrNames.forEach(function (attrName) {
          element.setAttribute(attrName, element.getAttribute(attrName).replace(paramRegExp, function (match, p1, offset, string) {
            try {
              // eslint-disable-next-line no-eval
              return eval("values.".concat(p1));
            } catch (e) {
              return match;
            }
          }));
        });
      });
      return this;
    }
  }, {
    key: "value",
    value: function value() {
      return this.elements;
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

  return Elements;
}();

module.exports = Elements;
