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

var E = require('./E');

var _require = require('./../cutie/exports'),
    as = _require.as;

var _require2 = require('./../async-ajax/exports'),
    ResponseFromAjaxRequest = _require2.ResponseFromAjaxRequest,
    ResponseBody = _require2.ResponseBody,
    ResponseHeaders = _require2.ResponseHeaders,
    ResponseStatusCode = _require2.ResponseStatusCode,
    JSResponseByHTTPReponseComponents = _require2.JSResponseByHTTPReponseComponents;

var _require3 = require('./../async-string/exports'),
    StringFromBuffer = _require3.StringFromBuffer;

var _require4 = require('./../async-json/exports'),
    ParsedJSON = _require4.ParsedJSON;

var _require5 = require('./../actions/exports'),
    AppliedActionsOnResponse = _require5.AppliedActionsOnResponse;

var GOOGLE_API_SRC = 'https://apis.google.com/js/api:client.js';

var E_GOOGLE_OAUTH_BUTTON =
/*#__PURE__*/
function (_E) {
  _inherits(E_GOOGLE_OAUTH_BUTTON, _E);

  function E_GOOGLE_OAUTH_BUTTON(node) {
    _classCallCheck(this, E_GOOGLE_OAUTH_BUTTON);

    return _possibleConstructorReturn(this, _getPrototypeOf(E_GOOGLE_OAUTH_BUTTON).call(this, node));
  }

  _createClass(E_GOOGLE_OAUTH_BUTTON, [{
    key: "activate",
    value: function activate() {
      var _this = this;

      this.replaceWithButton();
      var googleSignInMetaElm = this.googleSignInMetaElm();
      var googleApiScriptElm = this.googleApiScriptElm();
      document.head.prepend(googleSignInMetaElm, googleApiScriptElm);
      this.node.style.display = 'none';

      googleApiScriptElm.onload = function () {
        _this.initGoogleOauth();
      };
    }
  }, {
    key: "replaceWithButton",
    value: function replaceWithButton() {
      var button = document.createElement('button');
      button.setAttribute('data-e-google-oauth-button', 'true');

      for (var i = 0; i < this.node.attributes.length; i++) {
        button.setAttribute(this.node.attributes[i].name, this.node.attributes[i].value);
      }

      while (this.node.firstChild) {
        var child = this.node.removeChild(this.node.firstChild);
        button.appendChild(child);
      }

      this.node.parentNode.replaceChild(button, this.node);
      this.node = button;
    }
  }, {
    key: "initGoogleOauth",
    value: function initGoogleOauth() {
      var _this2 = this;

      this.node.style.display = ''; // eslint-disable-next-line no-undef

      gapi.load('auth2', function () {
        // eslint-disable-next-line no-undef
        var auth2 = gapi.auth2.init({
          client_id: _this2.node.getAttribute('data-client-id'),
          cookiepolicy: _this2.node.getAttribute('data-cookiepolicy') || 'single_host_origin',
          scope: _this2.node.getAttribute('data-scope') || 'profile'
        });
        auth2.attachClickHandler(_this2.node, {}, function (googleUser) {
          var body = {};
          body[_this2.node.getAttribute('data-request-token-key') || 'googleToken'] = googleUser.getAuthResponse().id_token;
          new ResponseFromAjaxRequest({
            url: _this2.node.getAttribute('data-redirect-url') || '/',
            method: 'POST'
          }, JSON.stringify(body)).as('RESPONSE').after(new AppliedActionsOnResponse(_this2.node.tagName, _this2.node.getAttribute('data-response-name'), new JSResponseByHTTPReponseComponents(new ParsedJSON(new StringFromBuffer(new ResponseBody(as('RESPONSE')))), new ResponseHeaders(as('RESPONSE')), new ResponseStatusCode(as('RESPONSE'))), _this2.node.getAttribute('data-actions-on-response'))).call();
        }, function (error) {
          throw error;
        });
      });
    }
  }, {
    key: "googleSignInMetaElm",
    value: function googleSignInMetaElm() {
      var googleSignInMetaElm = document.createElement('meta');
      googleSignInMetaElm.setAttribute('name', 'google-signin-client_id');
      googleSignInMetaElm.setAttribute('content', this.node.getAttribute('data-client-id'));
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

  return E_GOOGLE_OAUTH_BUTTON;
}(E);

module.exports = E_GOOGLE_OAUTH_BUTTON;
