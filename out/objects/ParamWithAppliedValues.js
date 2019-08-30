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
  }

  _createClass(ParamWithAppliedValues, [{
    key: "value",
    value: function value() {
      var _this = this;

      return this.param.replace(/\$\{([^{}]+|\S*)\}/g, function (match, p1, offset, string) {
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

      if (pathParts.length - 1 === index) {
        return values[pathParts[index]];
      } else {
        return this.valueOf(values[pathParts[index]], pathParts, index + 1);
      }
    }
  }]);

  return ParamWithAppliedValues;
}();

module.exports = ParamWithAppliedValues;
