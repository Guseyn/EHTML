'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _require = require('@page-libs/cutie'),
    browserified = _require.browserified;

var _require2 = require('@page-libs/ajax'),
    ResponseFromAjaxRequest = _require2.ResponseFromAjaxRequest,
    ResponseBody = _require2.ResponseBody;

var _browserified = browserified(require('@cuties/json')),
    ParsedJSON = _browserified.ParsedJSON;

var AppliedActionsOnResponse = require('./../async/AppliedActionsOnResponse');

var E = require('./../E');

var GOOGLE_API_SRC = 'https://apis.google.com/js/api:client.js';
E('e-google-oauth-button',
/*#__PURE__*/
function (_HTMLButtonElement) {
  _inherits(_class, _HTMLButtonElement);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
  }

  _createClass(_class, [{
    key: "onRender",
    value: function onRender() {
      var _this = this;

      var googleSignInMetaElm = this.googleSignInMetaElm();
      var googleApiScriptElm = this.googleApiScriptElm();
      document.head.prepend(googleSignInMetaElm, googleApiScriptElm);
      this.style['display'] = 'none';

      googleApiScriptElm.onload = function () {
        _this.initGoogleOauth();
      };

      this.rendered = true;
    }
  }, {
    key: "initGoogleOauth",
    value: function initGoogleOauth() {
      var _this2 = this;

      this.style['display'] = ''; // eslint-disable-next-line no-undef

      gapi.load('auth2', function () {
        // eslint-disable-next-line no-undef
        var auth2 = gapi.auth2.init({
          client_id: _this2.getAttribute('data-client-id'),
          cookiepolicy: _this2.getAttribute('data-cookiepolicy') || 'single_host_origin',
          scope: _this2.getAttribute('data-scope') || 'profile'
        });
        auth2.attachClickHandler(_this2, {}, function (googleUser) {
          var body = {};
          body[_this2.getAttribute('data-request-token-key') || 'googleToken'] = googleUser.getAuthResponse().id_token;
          new AppliedActionsOnResponse(_this2.tagName, _this2.getAttribute('data-response-object-name'), _this2.getAttribute('data-actions-on-response'), new ParsedJSON(new ResponseBody(new ResponseFromAjaxRequest({
            url: _this2.getAttribute('data-redirect-url') || '/',
            method: 'POST'
          }, JSON.stringify(body))))).call();
        }, function (error) {
          console.log(JSON.stringify(error, undefined, 2));
        });
      });
    }
  }, {
    key: "googleSignInMetaElm",
    value: function googleSignInMetaElm() {
      var googleSignInMetaElm = document.createElement('meta');
      googleSignInMetaElm.setAttribute('name', 'google-signin-client_id');
      googleSignInMetaElm.setAttribute('content', this.getAttribute('data-client-id'));
      return googleSignInMetaElm;
    }
  }, {
    key: "googleApiScriptElm",
    value: function googleApiScriptElm() {
      var googleApiScriptElm = document.createElement('script');
      googleApiScriptElm.setAttribute('src', GOOGLE_API_SRC);
      return googleApiScriptElm;
    }
  }]);

  return _class;
}(_wrapNativeSuper(HTMLButtonElement)), {
  "extends": 'button'
});
