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

var _browserified = browserified(require('@cuties/object')),
    Value = _browserified.Value;

var _browserified2 = browserified(require('@cuties/json')),
    ParsedJSON = _browserified2.ParsedJSON;

var HTMLTunedElement = require('./HTMLTunedElement');

var LocalStorageWithSetValue = require('./async/LocalStorageWithSetValue');

var GOOGLE_API_SRC = 'https://apis.google.com/js/api:client.js';

var EGoogleOauthButton =
/*#__PURE__*/
function (_HTMLTunedElement) {
  _inherits(EGoogleOauthButton, _HTMLTunedElement);

  function EGoogleOauthButton() {
    _classCallCheck(this, EGoogleOauthButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(EGoogleOauthButton).call(this));
  }

  _createClass(EGoogleOauthButton, [{
    key: "render",
    value: function render() {
      var metaElm = this.metaElm();
      var scriptElm = this.scriptElm();
      document.head.prepend(metaElm, scriptElm);
      var button = this.replaceWithButton(this);
      var instance = this;

      scriptElm.onload = function () {
        button.style['display'] = '';
        instance.initGoogleOauth(button);
      };

      this.rendered = true;
    }
  }, {
    key: "initGoogleOauth",
    value: function initGoogleOauth(button) {
      var instance = this; // eslint-disable-next-line no-undef

      gapi.load('auth2', function () {
        // eslint-disable-next-line no-undef
        var auth2 = gapi.auth2.init({
          client_id: instance.getAttribute('data-client-id'),
          cookiepolicy: instance.getAttribute('data-cookiepolicy') || 'single_host_origin',
          scope: instance.getAttribute('data-scope') || 'profile'
        });
        auth2.attachClickHandler(button, {}, function (googleUser) {
          var body = {};
          body[instance.getAttribute('data-request-token-key') || 'googleToken'] = googleUser.getAuthResponse().id_token;
          new LocalStorageWithSetValue(localStorage, instance.getAttribute('data-local-storage-jwt-key') || 'jwt', new Value(new ParsedJSON(new ResponseBody(new ResponseFromAjaxRequest({
            url: instance.getAttribute('data-redirect-url') || '/',
            method: 'POST'
          }, JSON.stringify(body)))), instance.getAttribute('data-response-jwt-key') || 'jwt')).call();
        }, function (error) {
          console.log(JSON.stringify(error, undefined, 2));
        });
      });
    }
  }, {
    key: "metaElm",
    value: function metaElm() {
      var googleSignInMetaElm = document.createElement('meta');
      googleSignInMetaElm.setAttribute('name', 'google-signin-client_id');
      googleSignInMetaElm.setAttribute('content', this.getAttribute('data-client-id'));
      return googleSignInMetaElm;
    }
  }, {
    key: "scriptElm",
    value: function scriptElm() {
      var googleApiScriptElm = document.createElement('script');
      googleApiScriptElm.setAttribute('src', GOOGLE_API_SRC);
      return googleApiScriptElm;
    }
  }, {
    key: "replaceWithButton",
    value: function replaceWithButton(googleOauthButton) {
      var button = document.createElement('button');
      button.style['display'] = 'none';
      this.copyAttributes(button, googleOauthButton);
      this.moveChildren(button, googleOauthButton);
      return button;
    }
  }, {
    key: "copyAttributes",
    value: function copyAttributes(toElm, fromElm) {
      fromElm.getAttributeNames().forEach(function (name) {
        toElm.setAttribute(name, fromElm.getAttribute(name));
      });
    }
  }, {
    key: "moveChildren",
    value: function moveChildren(toElm, fromElm) {
      while (fromElm.firstChild) {
        var child = fromElm.removeChild(fromElm.firstChild);
        toElm.appendChild(child);
      }

      fromElm.parentNode.replaceChild(toElm, fromElm);
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['data-client-id', 'data-cookiepolicy', 'data-scope', 'data-redirect-url', 'data-local-storage-jwt-key', 'data-response-jwt-key', 'data-request-token-key'];
    }
  }]);

  return EGoogleOauthButton;
}(HTMLTunedElement);

window.customElements.define('e-google-oauth-button', EGoogleOauthButton);
