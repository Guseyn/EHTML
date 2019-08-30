'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ParamWithAppliedMemoryStorage =
/*#__PURE__*/
function () {
  function ParamWithAppliedMemoryStorage(param) {
    _classCallCheck(this, ParamWithAppliedMemoryStorage);

    this.param = param;
  }

  _createClass(ParamWithAppliedMemoryStorage, [{
    key: "value",
    value: function value() {
      return this.param.replace(/\$\{memoryStorage\.(.+)\}/g, function (match, p1, offset, string) {
        // eslint-disable-next-line no-undef
        return memoryStorage.getItem(p1);
      });
    }
  }]);

  return ParamWithAppliedMemoryStorage;
}();

module.exports = ParamWithAppliedMemoryStorage;
