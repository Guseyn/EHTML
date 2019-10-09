"use strict";
'use string';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StringWithMappedObjectAndAppliedVariables =
/*#__PURE__*/
function () {
  function StringWithMappedObjectAndAppliedVariables(str, obj, objName) {
    _classCallCheck(this, StringWithMappedObjectAndAppliedVariables);

    this.str = str;
    this.obj = obj;
    this.objName = objName;
  }

  _createClass(StringWithMappedObjectAndAppliedVariables, [{
    key: "value",
    value: function value() {
      var _this = this;

      this.str = this.str.replace(/\${((\s)?([^{}$]+\s)?(localStorage)(\.[^\s{}$]+)?(\s)?(\s[^{}$]+)?)}/g, function (match, p1) {
        // eslint-disable-next-line no-undef
        var expression = match.replace(/localStorage(\.[^{}$\s]+)?/g, function (match, p1) {
          return "'".concat(localStorage.getItem(p1.split('.')[1]), "'");
        }); // eslint-disable-next-line no-eval

        return expression;
      }).replace(/\${((\s)?([^{}$]+\s)?(sessionStorage)(\.[^\s{}$]+)?(\s)?(\s[^{}$]+)?)}/g, function (match, p1) {
        // eslint-disable-next-line no-undef
        var expression = match.replace(/sessionStorage(\.[^{}$\s]+)?/g, function (match, p1) {
          return "'".concat(sessionStorage.getItem(p1.split('.')[1]), "'");
        }); // eslint-disable-next-line no-eval

        return expression;
      }).replace(/\${((\s)?([^{}$]+\s)?(urlParams)(\.[^\s{}$]+)?(\s)?(\s[^{}$]+)?)}/g, function (match, p1) {
        var expression = match.replace(/urlParams(\.[^{}$\s]+)?/g, function (match, p1) {
          // eslint-disable-next-line no-undef, no-eval
          return eval("'urlParams".concat(p1, "'"));
        }); // eslint-disable-next-line no-eval

        return expression;
      });

      if (this.obj) {
        return this.str.replace(new RegExp("\\${((\\s)?([^{}$]+\\s)?(".concat(this.objName, ")(\\.[^\\s{}$]+)?(\\s)?(\\s[^{}$]+)?)}"), 'g'), function (match, p1) {
          // eslint-disable-next-line no-unused-vars
          var obj = _this.obj;
          var objName = _this.objName;
          var expression = "\n            const ".concat(objName, " = obj['").concat(objName, "']\n            ").concat(p1, "\n          "); // eslint-disable-next-line no-eval

          var res = eval(expression);

          if (_typeof(res) === 'object') {
            return JSON.stringify(res);
          }

          return res;
        });
      }

      return this.str.replace(/\$\{([^{}\s]+)\}/g, function (match, p1) {
        try {
          // eslint-disable-next-line no-eval
          var res = eval(p1);

          if (_typeof(res) === 'object') {
            return JSON.stringify(res);
          }

          return res;
        } catch (error) {
          return match;
        }
      });
    }
  }]);

  return StringWithMappedObjectAndAppliedVariables;
}();

module.exports = StringWithMappedObjectAndAppliedVariables;
