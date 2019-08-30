'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ParamWithAppliedValues =
/*#__PURE__*/
function () {
  function ParamWithAppliedValues(param, values) {
    _classCallCheck(this, ParamWithAppliedValues);

    this.param = param;
    this.values = values;
    this.paramRegExp = /\$\{([^{}]+|\S*)\}/g;
  }

  _createClass(ParamWithAppliedValues, [{
    key: "value",
    value: function value() {
      return this.param.replace(this.paramRegExp, function (match, p1, offset, string) {
        try {
          // eslint-disable-next-line no-eval
          return eval("this.values.".concat(p1));
        } catch (e) {
          return match;
        }
      });
    }
  }]);

  return ParamWithAppliedValues;
}();

module.exports = ParamWithAppliedValues;
