'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StringWithAppliedStorageVariables =
/*#__PURE__*/
function () {
  function StringWithAppliedStorageVariables(str) {
    _classCallCheck(this, StringWithAppliedStorageVariables);

    this.str = str;
  }

  _createClass(StringWithAppliedStorageVariables, [{
    key: "value",
    value: function value() {
      return this.str.replace(/\${((\s)?([^{}$]+\s)?(localStorage)(\.[^\s{}$]+)?(\s)?(\s[^{}$]+)?)}/g, function (match, p1) {
        // eslint-disable-next-line no-undef
        var expression = p1.replace(/localStorage(\.[^{}$\s]+)?/g, function (match, p1) {
          return "'".concat(localStorage.getItem(p1.split('.')[1]), "'");
        }); // eslint-disable-next-line no-eval

        return eval(expression);
      }).replace(/\${((\s)?([^{}$]+\s)?(sessionStorage)(\.[^\s{}$]+)?(\s)?(\s[^{}$]+)?)}/g, function (match, p1) {
        // eslint-disable-next-line no-undef
        var expression = p1.replace(/sessionStorage(\.[^{}$\s]+)?/g, function (match, p1) {
          return "'".concat(sessionStorage.getItem(p1.split('.')[1]), "'");
        }); // eslint-disable-next-line no-eval

        return eval(expression);
      });
    }
  }]);

  return StringWithAppliedStorageVariables;
}();

module.exports = StringWithAppliedStorageVariables;
