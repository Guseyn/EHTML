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
    browserified = _require.browserified,
    as = _require.as;

var _browserified = browserified(require('@cuties/object')),
    CreatedOptions = _browserified.CreatedOptions;

var _browserified2 = browserified(require('@cuties/json')),
    ParsedJSON = _browserified2.ParsedJSON;

var _browserified3 = browserified(require('@cuties/buffer')),
    StringFromBuffer = _browserified3.StringFromBuffer;

var _require2 = require('@page-libs/ajax'),
    ResponseFromAjaxRequest = _require2.ResponseFromAjaxRequest,
    ResponseBody = _require2.ResponseBody;

var _require3 = require('@page-libs/dom'),
    ElementWithInnerHTML = _require3.ElementWithInnerHTML;

var ExtractedDocument = require('./../async/ExtractedDocument');

var BodyInnerHTMLOfDocument = require('./../async/BodyInnerHTMLOfDocument');

var TitleOfDocument = require('./../async/TitleOfDocument');

var PushedStateToHistory = require('./../async/PushedStateToHistory');

var ChangedPageTitle = require('./../async/ChangedPageTitle');

var E = require('./../E');

if (!sessionStorage.getItem('isFirstStatePushedToHistory')) {
  sessionStorage.setItem('isFirstStatePushedToHistory', 'false');
}

window.onpopstate = function (event) {
  if (event.state) {
    document.body.innerHTML = event.state.body;
    document.title = event.state.title;
  }
};

window.onload = function () {
  if (sessionStorage.getItem('isFirstStatePushedToHistory') === 'false') {
    history.replaceState({
      body: document.body.innerHTML,
      title: document.title
    }, null, location.pathname + location.search);
    sessionStorage.setItem('isFirstStatePushedToHistory', 'true');
  }
};

var ETurboLink =
/*#__PURE__*/
function (_E) {
  _inherits(ETurboLink, _E);

  function ETurboLink() {
    _classCallCheck(this, ETurboLink);

    return _possibleConstructorReturn(this, _getPrototypeOf(ETurboLink).call(this));
  }

  _createClass(ETurboLink, [{
    key: "onRender",
    value: function onRender() {
      var _this = this;

      this.addEventListener('click', function () {
        new ExtractedDocument(new StringFromBuffer(new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', _this.getAttribute('data-href'), 'method', 'GET', 'headers', new ParsedJSON(_this.getAttribute('data-headers') || '{}')))))).as('DOC').after(new BodyInnerHTMLOfDocument(as('DOC')).as('BODY').after(new TitleOfDocument(as('DOC')).as('TITLE').after(new PushedStateToHistory(new CreatedOptions('body', as('BODY'), 'title', as('TITLE')), _this.getAttribute('data-href')).after(new ElementWithInnerHTML(document.body, as('BODY')).after(new ChangedPageTitle(document, as('TITLE'))))))).call();
      });
    }
  }]);

  return ETurboLink;
}(E);

window.customElements.define('e-turbolink', ETurboLink);
module.exports = ETurboLink;
