'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('@page-libs/cutie'),
    browserified = _require.browserified,
    as = _require.as;

var _browserified = browserified(require('@cuties/object')),
    CreatedOptions = _browserified.CreatedOptions;

var _browserified2 = browserified(require('@cuties/buffer')),
    StringFromBuffer = _browserified2.StringFromBuffer;

var _require2 = require('@page-libs/ajax'),
    ResponseFromAjaxRequest = _require2.ResponseFromAjaxRequest,
    ResponseBody = _require2.ResponseBody;

var _require3 = require('@page-libs/dom'),
    ElementWithInnerHTML = _require3.ElementWithInnerHTML;

var ExtractedDocument = require('./ExtractedDocument');

var BodyInnerHTMLOfDocument = require('./BodyInnerHTMLOfDocument');

var TitleOfDocument = require('./TitleOfDocument');

var PushedStateToHistory = require('./PushedStateToHistory');

var ChangedPageTitle = require('./ChangedPageTitle');

var TurboRedirected = function TurboRedirected(href, headers) {
  _classCallCheck(this, TurboRedirected);

  return new ExtractedDocument(new StringFromBuffer(new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', href, 'method', 'GET', 'headers', headers))))).as('DOC').after(new BodyInnerHTMLOfDocument(as('DOC')).as('BODY').after(new TitleOfDocument(as('DOC')).as('TITLE').after(new PushedStateToHistory(new CreatedOptions('body', as('BODY'), 'title', as('TITLE')), href).after(new ElementWithInnerHTML(document.body, as('BODY')).after(new ChangedPageTitle(document, as('TITLE')))))));
};

module.exports = TurboRedirected;
