"use strict";
'use string';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var uuidv4 = require('uuid/v4');

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
      this.str = this.stringWithLocalStorageVariables(this.stringWithSessionStorageVariables(this.stringWithUrlParams(this.str)));

      if (this.obj) {
        this.str = this.stringWithMappedObject(this.str, this.obj, this.objName);
        return this.str;
      }

      return this.evalString(this.str);
    }
  }, {
    key: "stringWithLocalStorageVariables",
    value: function stringWithLocalStorageVariables(str) {
      return str.replace(/\${((\s)?([^{}$]+\s)?(localStorage)(\.[^\s{}$]+)?(\s)?(\s[^{}$]+)?)}/g, function (match, p1) {
        // eslint-disable-next-line no-undef
        var expression = match.replace(/localStorage(\.[^{}$\s]+)?/g, function (match, p1) {
          return "'".concat(localStorage.getItem(p1.split('.')[1]), "'");
        }); // eslint-disable-next-line no-eval

        return expression;
      });
    }
  }, {
    key: "stringWithSessionStorageVariables",
    value: function stringWithSessionStorageVariables(str) {
      return str.replace(/\${((\s)?([^{}$]+\s)?(sessionStorage)(\.[^\s{}$]+)?(\s)?(\s[^{}$]+)?)}/g, function (match, p1) {
        // eslint-disable-next-line no-undef
        var expression = match.replace(/sessionStorage(\.[^{}$\s]+)?/g, function (match, p1) {
          return "'".concat(sessionStorage.getItem(p1.split('.')[1]), "'");
        }); // eslint-disable-next-line no-eval

        return expression;
      });
    }
  }, {
    key: "stringWithUrlParams",
    value: function stringWithUrlParams(str) {
      return str.replace(/\${((\s)?([^{}$]+\s)?(urlParams)(\.[^\s{}$]+)?(\s)?(\s[^{}$]+)?)}/g, function (match, p1) {
        var expression = match.replace(/urlParams(\.[^{}$\s]+)?/g, function (match, p1) {
          // eslint-disable-next-line no-undef, no-eval
          return eval("'urlParams".concat(p1, "'"));
        }); // eslint-disable-next-line no-eval

        return expression;
      });
    }
  }, {
    key: "stringWithMappedObject",
    value: function stringWithMappedObject(str, obj, objName) {
      return str.replace(new RegExp("\\${((\\s)?([^{}$]+\\s)?(".concat(objName, ")(\\.[^\\s{}$]+)?(\\s)?(\\s[^{}$]+)?)}"), 'g'), function (match, p1, p2, p3, p4) {
        var expression = "\n          const ".concat(objName, " = obj['").concat(objName, "']\n          ").concat(p1, "\n        ");

        if (objName === 'user') {
          console.log(match);
        }

        try {
          // eslint-disable-next-line no-eval
          var res = eval(expression);

          if (_typeof(res) === 'object') {
            return JSON.stringify(res);
          }

          return res;
        } catch (error) {
          var _res = match.replace(p4, function () {
            var name = uuidv4();
            window[name] = obj[objName];
            return "window['".concat(name, "']");
          });

          return _res;
        }
      });
    }
  }, {
    key: "evalString",
    value: function evalString(str) {
      return str.replace(/\$\{([^{}\s]+)\}/g, function (match, p1) {
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
