"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require('@page-libs/cutie'),
    AsyncObject = _require.AsyncObject;

var RequestBodyWithAppliedLocalStorageValues =
/*#__PURE__*/
function (_AsyncObject) {
  _inherits(RequestBodyWithAppliedLocalStorageValues, _AsyncObject);

  function RequestBodyWithAppliedLocalStorageValues(body) {
    _classCallCheck(this, RequestBodyWithAppliedLocalStorageValues);

    return _possibleConstructorReturn(this, _getPrototypeOf(RequestBodyWithAppliedLocalStorageValues).call(this, JSON.parse(body)));
  }

  _createClass(RequestBodyWithAppliedLocalStorageValues, [{
    key: "syncCall",
    value: function syncCall() {
      var _this = this;

      return function (body) {
        return JSON.stringify(_this.bodyWithAppliedLocalStorageValues(body));
      };
    }
  }, {
    key: "bodyWithAppliedLocalStorageValues",
    value: function bodyWithAppliedLocalStorageValues(body) {
      var _this2 = this;

      if (this.isObject(body)) {
        Object.keys(body).forEach(function (key) {
          body[key] = _this2.bodyWithAppliedLocalStorageValues(body[key]);
        });
      } else if (this.isArray(body)) {
        body.forEach(function (value, index) {
          body[index] = _this2.bodyWithAppliedLocalStorageValues(body[index]);
        });
      } else if (this.isString(body)) {
        body = body.replace(/\$\{localStorage\.(.+)\}/g, function (match, p1, offset, string) {
          return window.localStorage.getItem(p1);
        });
      }

      return body;
    }
  }, {
    key: "isObject",
    value: function isObject(value) {
      return value && _typeof(value) === 'object' && value.constructor === Object;
    }
  }, {
    key: "isArray",
    value: function isArray(value) {
      return value && _typeof(value) === 'object' && value.constructor === Array;
    }
  }, {
    key: "isString",
    value: function isString(value) {
      return typeof value === 'string' || value instanceof String;
    }
  }]);

  return RequestBodyWithAppliedLocalStorageValues;
}(AsyncObject);

module.exports = RequestBodyWithAppliedLocalStorageValues;
