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

var E_GITHUB_OAUTH_BUTTON =
/*#__PURE__*/
function (_E) {
  _inherits(E_GITHUB_OAUTH_BUTTON, _E);

  function E_GITHUB_OAUTH_BUTTON(node) {
    _classCallCheck(this, E_GITHUB_OAUTH_BUTTON);

    return _possibleConstructorReturn(this, _getPrototypeOf(E_GITHUB_OAUTH_BUTTON).call(this, node));
  }

  _createClass(E_GITHUB_OAUTH_BUTTON, [{
    key: "activate",
    value: function activate() {
      this.replaceWithButton();
      this.initGighubOauth();
    }
  }, {
    key: "replaceWithButton",
    value: function replaceWithButton() {
      var button = document.createElement('button');
      button.setAttribute('data-e-github-oauth-button', 'true');

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
    key: "initGighubOauth",
    value: function initGighubOauth() {
      var clientId = this.node.getAttribute('data-client-id');
      var redirectURI = this.node.getAttribute('data-redirect-uri');
      var scope = this.node.getAttribute('data-scope');
      this.node.addEventListener('click', function () {
        window.location = "https://github.com/login/oauth/authorize?client_id=".concat(clientId, "&redirect_uri=").concat(redirectURI, "&scope=").concat(scope);
      });
    }
  }]);

  return E_GITHUB_OAUTH_BUTTON;
}(E);

module.exports = E_GITHUB_OAUTH_BUTTON;
