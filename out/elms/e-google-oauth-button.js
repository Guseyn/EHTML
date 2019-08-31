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

var _browserified2 = browserified(require('@cuties/object')),
    TheSameObjectWithValue = _browserified2.TheSameObjectWithValue;

var HTMLTunedElement = require('./../global-objects/HTMLTunedElement');

var GOOGLE_API_SRC = 'https://apis.google.com/js/api:client.js';

var EGoogleOauthButton =
/*#__PURE__*/
function (_HTMLTunedElement) {
  _inherits(EGoogleOauthButton, _HTMLTunedElement);

  function EGoogleOauthButton() {
    var _this;

    _classCallCheck(this, EGoogleOauthButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EGoogleOauthButton).call(this));
    _this.values = {};
    return _this;
  }

  _createClass(EGoogleOauthButton, [{
    key: "supportedActions",
    value: function supportedActions() {
      return ['redirect', 'saveToLocalStorage', 'saveToMemoryStorage', 'innerHTML', 'addHTMLTo', 'applyTextsAndValuesToChildNodes', 'hideElms', 'showElms', 'disableElms', 'enableElms', 'changeElmsClassName'];
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var googleSignInMetaElm = this.googleSignInMetaElm();
      var googleApiScriptElm = this.googleApiScriptElm();
      document.head.prepend(googleSignInMetaElm, googleApiScriptElm);
      this.style['display'] = 'none';

      googleApiScriptElm.onload = function () {
        _this2.initGoogleOauth();
      };

      this.rendered = true;
    }
  }, {
    key: "initGoogleOauth",
    value: function initGoogleOauth() {
      var _this3 = this;

      this.style['display'] = ''; // eslint-disable-next-line no-undef

      gapi.load('auth2', function () {
        // eslint-disable-next-line no-undef
        var auth2 = gapi.auth2.init({
          client_id: _this3.getAttribute('data-client-id'),
          cookiepolicy: _this3.getAttribute('data-cookiepolicy') || 'single_host_origin',
          scope: _this3.getAttribute('data-scope') || 'profile'
        });
        auth2.attachClickHandler(_this3, {}, function (googleUser) {
          var body = {};
          body[_this3.getAttribute('data-request-token-key') || 'googleToken'] = googleUser.getAuthResponse().id_token;
          new TheSameObjectWithValue(_this3.values, _this3.getAttribute('data-object'), new ParsedJSON(new ResponseBody(new ResponseFromAjaxRequest({
            url: _this3.getAttribute('data-redirect-url') || '/',
            method: 'POST'
          }, JSON.stringify(body))))).after(_this3.actions(_this3.values)).call();
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
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['data-client-id', 'data-cookiepolicy', 'data-scope', 'data-redirect-url', 'data-local-storage-jwt-key'];
    }
  }]);

  return EGoogleOauthButton;
}(HTMLTunedElement);

module.exports = EGoogleOauthButton;
