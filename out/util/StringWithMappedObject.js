"use strict";
'use string';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StringWithMappedObject =
/*#__PURE__*/
function () {
  function StringWithMappedObject(str, obj, objName) {
    _classCallCheck(this, StringWithMappedObject);

    this.str = str;
    this.obj = obj;
    this.objName = objName;
  }

  _createClass(StringWithMappedObject, [{
    key: "value",
    value: function value() {
      var _this = this;

      return this.str.replace(/\$\{([^{}\s]+)\}/g, function (match, p1, offset, string) {
        try {
          var res = _this.valueOf(_this.obj, p1.split('.'));

          if (_typeof(res) === 'object') {
            return JSON.stringify(res);
          }

          return res;
        } catch (e) {
          return match;
        }
      });
    }
  }, {
    key: "valueOf",
    value: function valueOf(obj, pathParts) {
      var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      if (pathParts.length - 1 === index) {
        return obj[pathParts[index]];
      } else {
        return this.valueOf(obj[pathParts[index]], pathParts, index + 1);
      }
    }
  }]);

  return StringWithMappedObject;
}();

module.exports = StringWithMappedObject;
