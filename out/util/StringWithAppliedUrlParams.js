'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StringWithAppliedUrlParams =
/*#__PURE__*/
function () {
  function StringWithAppliedUrlParams(str) {
    _classCallCheck(this, StringWithAppliedUrlParams);

    this.str = str;
  }

  _createClass(StringWithAppliedUrlParams, [{
    key: "value",
    value: function value() {
      return this.str.replace(/\$\{urlParams\.(.+)\}/g, function (match, p1, offset, string) {
        // eslint-disable-next-line no-undef
        return urlParams[p1];
      });
    }
  }]);

  return StringWithAppliedUrlParams;
}();

module.exports = StringWithAppliedUrlParams;
