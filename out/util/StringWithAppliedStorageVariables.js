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
      return this.str.replace(/\$\{((localStorage\.([^\s]+))(.+)?)\}/g, function (match, p1, p2, p3, p4, offset, string) {
        // eslint-disable-next-line no-undef
        var expression = p1.replace(p2, "'".concat(localStorage.getItem(p3), "'")); // eslint-disable-next-line no-eval

        return eval(expression);
      }).replace(/\$\{((sessionStorage\.([^\s]+))(.+)?)\}/g, function (match, p1, p2, p3, p4, offset, string) {
        // eslint-disable-next-line no-undef
        var expression = p1.replace(p2, "'".concat(sessionStorage.getItem(p3), "'")); // eslint-disable-next-line no-eval

        return eval(expression);
      });
    }
  }]);

  return StringWithAppliedStorageVariables;
}();

module.exports = StringWithAppliedStorageVariables;
