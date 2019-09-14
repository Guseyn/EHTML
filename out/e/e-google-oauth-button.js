'use strict';

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
    browserified = _require.browserified;

var _require2 = require('@page-libs/ajax'),
    ResponseFromAjaxRequest = _require2.ResponseFromAjaxRequest,
    ResponseBody = _require2.ResponseBody;

var _browserified = browserified(require('@cuties/json')),
    ParsedJSON = _browserified.ParsedJSON;

var AppliedActions = require('./../async/AppliedActions');

var E = require('./../E');

var GOOGLE_API_SRC = 'https://apis.google.com/js/api:client.js';

var EGoogleOauthButton =
/*#__PURE__*/
function (_E) {
  _inherits(EGoogleOauthButton, _E);

  function EGoogleOauthButton() {
    _classCallCheck(this, EGoogleOauthButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(EGoogleOauthButton).call(this));
  }

  _createClass(EGoogleOauthButton, [{
    key: "supportedActions",
    value: function supportedActions() {
      return ['redirect', 'saveToLocalStorage', 'saveToMemoryStorage', 'innerHTML', 'addHTMLTo', 'mapObjToElm', 'hideElms', 'showElms', 'disableElms', 'enableElms', 'changeElmsClassName'];
    }
  }, {
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
          client_id: _this2.attr('data-client-id'),
          cookiepolicy: _this2.attr('data-cookiepolicy') || 'single_host_origin',
          scope: _this2.attr('data-scope') || 'profile'
        });
        auth2.attachClickHandler(_this2, {}, function (googleUser) {
          var body = {};
          body[_this2.attr('data-request-token-key') || 'googleToken'] = googleUser.getAuthResponse().id_token;
          new AppliedActions(_this2.tagName, _this2.attr('data-object'), _this2.attr('data-actions'), _this2.supportedActions(), new ParsedJSON(new ResponseBody(new ResponseFromAjaxRequest({
            url: _this2.attr('data-redirect-url') || '/',
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
      googleSignInMetaElm.setAttribute('content', this.attr('data-client-id'));
      return googleSignInMetaElm;
    }
  }, {
    key: "googleApiScriptElm",
    value: function googleApiScriptElm() {
      var googleApiScriptElm = document.createElement('script');
      googleApiScriptElm.setAttribute('src', GOOGLE_API_SRC);
      return googleApiScriptElm;
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['data-client-id', 'data-cookiepolicy', 'data-scope', 'data-redirect-url', 'data-local-storage-jwt-key'];
    }
  }]);

  return EGoogleOauthButton;
}(E);

window.customElements.define('e-google-oauth-button', EGoogleOauthButton);
module.exports = EGoogleOauthButton;
