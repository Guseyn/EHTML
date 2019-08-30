'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ParamWithAppliedLocalStorage =
/*#__PURE__*/
function () {
  function ParamWithAppliedLocalStorage(param) {
    _classCallCheck(this, ParamWithAppliedLocalStorage);

    this.param = param;
  }

  _createClass(ParamWithAppliedLocalStorage, [{
    key: "value",
    value: function value() {
      return this.param.replace(/\$\{localStorage\.(.+)\}/g, function (match, p1, offset, string) {
        return localStorage.getItem(p1);
      });
    }
  }]);

  return ParamWithAppliedLocalStorage;
}();

module.exports = ParamWithAppliedLocalStorage;
