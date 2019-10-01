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

      return this.str.replace(new RegExp("\\${(([^{}$]+)?(\\".concat(this.objName, "(\\.[^\\s{}$]+)?)([^{}$]+)?)}"), 'g'), function (match, p1, offset, string) {
        var obj = _this.obj;
        var objName = _this.objName;

        try {
          var expression = p1.replace(new RegExp("\\".concat(_this.objName, "(\\.[^\\s{}$]+)?"), 'g'), function (match, p1) {
            // eslint-disable-next-line no-eval
            var value = p1 ? eval("obj[objName]".concat(p1)) : obj[objName];

            if (_typeof(value) === 'object') {
              return JSON.stringify(value);
            }

            return value;
          }); // eslint-disable-next-line no-eval

          var res = eval("'".concat(expression, "'"));

          if (_typeof(res) === 'object') {
            return JSON.stringify(res);
          }

          return res;
        } catch (e) {
          console.log(e);
          return match;
        }
      });
    }
  }]);

  return StringWithMappedObject;
}();

module.exports = StringWithMappedObject;
