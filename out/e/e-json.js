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
    ResponseBody = _require2.ResponseBody,
    ResponseHeaders = _require2.ResponseHeaders,
    ResponseStatusCode = _require2.ResponseStatusCode;

var ShownElement = require('./../async/ShownElement');

var JSResponseByHTTPReponseComponents = require('./../async/JSResponseByHTTPReponseComponents');

var AppliedActionsOnResponse = require('./../async/AppliedActionsOnResponse');

var ParsedElmSelectors = require('./../util/ParsedElmSelectors');

var PreparedProgressBars = require('./../util/PreparedProgressBars');

var ShowProgressEvent = require('./../util/ShowProgressEvent');

var E = require('./../E');

E('e-json',
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(_class, _HTMLElement);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
  }

  _createClass(_class, [{
    key: "onRender",
    value: function onRender() {
      var event = this.getAttribute('data-event');
      this.progressBar = new PreparedProgressBars([new ParsedElmSelectors(this.getAttribute('data-progress-bar')).value()[0]]).value()[0];
      this.ajaxIcon = new ParsedElmSelectors(this.getAttribute('data-ajax-icon')).value()[0];

      if (this.ajaxIcon) {
        this.ajaxIcon.style.display = 'none';
      }

      if (event) {
        this.addEventListener(event, this.activate);
      } else {
        this.activate();
      }
    }
  }, {
    key: "activate",
    value: function activate() {
      new ShownElement(this.ajaxIcon).after(new ResponseFromAjaxRequest(new CreatedOptions('url', this.getAttribute('data-src'), 'method', 'GET', 'headers', new ParsedJSON(this.getAttribute('data-headers') || '{}'), 'progressEvent', new ShowProgressEvent(this.progressBar))).as('RESPONSE').after(new AppliedActionsOnResponse(this.tagName, this.getAttribute('data-response-name') || 'response', new JSResponseByHTTPReponseComponents(new ParsedJSON(new StringFromBuffer(new ResponseBody(as('RESPONSE')))), new ResponseHeaders(as('RESPONSE')), new ResponseStatusCode(as('RESPONSE'))), "hideElms('".concat(this.getAttribute('data-ajax-icon'), "');").concat(this.getAttribute('data-actions-on-response') || '')))).call();
    }
  }]);

  return _class;
}(_wrapNativeSuper(HTMLElement)));
