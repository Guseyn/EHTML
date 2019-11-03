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

var _require2 = require('./../async-dom/exports'),
    ParsedElmSelectors = _require2.ParsedElmSelectors,
    PreparedProgressBar = _require2.PreparedProgressBar,
    ShownElement = _require2.ShownElement,
    HiddenElement = _require2.HiddenElement;

var _require3 = require('./../async-ajax/exports'),
    ResponseFromAjaxRequest = _require3.ResponseFromAjaxRequest,
    ResponseBody = _require3.ResponseBody,
    ResponseHeaders = _require3.ResponseHeaders,
    ResponseStatusCode = _require3.ResponseStatusCode,
    JSResponseByHTTPReponseComponents = _require3.JSResponseByHTTPReponseComponents,
    CreatedOptions = _require3.CreatedOptions;

var _require4 = require('./../async-array/exports'),
    First = _require4.First;

var _require5 = require('./../async-json/exports'),
    ParsedJSON = _require5.ParsedJSON;

var _require6 = require('./../async-string/exports'),
    StringFromBuffer = _require6.StringFromBuffer;

var _require7 = require('./../events/exports'),
    ShowProgressEvent = _require7.ShowProgressEvent;

var _require8 = require('./../actions/exports'),
    AppliedActionsOnResponse = _require8.AppliedActionsOnResponse;

var EJSON =
/*#__PURE__*/
function (_E) {
  _inherits(EJSON, _E);

  function EJSON(node) {
    _classCallCheck(this, EJSON);

    return _possibleConstructorReturn(this, _getPrototypeOf(EJSON).call(this, node));
  }

  _createClass(EJSON, [{
    key: "activate",
    value: function activate() {
      new ShownElement(new First(new ParsedElmSelectors(this.node.getAttribute('data-ajax-icon'))).as('AJAX_ICON')).after(new PreparedProgressBar(new First(new ParsedElmSelectors(this.node.getAttribute('data-progress-bar')))).as('PROGRESS_BAR').after(new ResponseFromAjaxRequest(new CreatedOptions('url', this.node.getAttribute('data-src'), 'method', 'GET', 'headers', new ParsedJSON(this.node.getAttribute('data-headers') || '{}'), 'progressEvent', new ShowProgressEvent(as('PROGRESS_BAR')))).as('RESPONSE').after(new HiddenElement(as('AJAX_ICON')).after(new AppliedActionsOnResponse(this.node.tagName, this.node.getAttribute('data-response-name') || 'response', new JSResponseByHTTPReponseComponents(new ParsedJSON(new StringFromBuffer(new ResponseBody(as('RESPONSE')))), new ResponseHeaders(as('RESPONSE')), new ResponseStatusCode(as('RESPONSE'))), this.node.getAttribute('data-actions-on-response')))))).call();
    }
  }]);

  return EJSON;
}(E);

module.exports = EJSON;
