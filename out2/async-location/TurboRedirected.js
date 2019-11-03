'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./../cutie/exports'),
    as = _require.as;

var _require2 = require('./../async-string/exports'),
    StringFromBuffer = _require2.StringFromBuffer;

var _require3 = require('./../async-ajax/exports'),
    ResponseFromAjaxRequest = _require3.ResponseFromAjaxRequest,
    ResponseBody = _require3.ResponseBody,
    CreatedOptions = _require3.CreatedOptions;

var _require4 = require('./../async-dom/exports'),
    ElementWithInnerHTML = _require4.ElementWithInnerHTML,
    BodyInnerHTMLOfDocument = _require4.BodyInnerHTMLOfDocument,
    ExtractedDocument = _require4.ExtractedDocument,
    TitleOfDocument = _require4.TitleOfDocument,
    FaviconOfDocument = _require4.FaviconOfDocument,
    ChangedPageTitle = _require4.ChangedPageTitle,
    ChangedPageFavicon = _require4.ChangedPageFavicon;

var _require5 = require('./../async-history/exports'),
    PushedStartStateToHistoryIfNeeded = _require5.PushedStartStateToHistoryIfNeeded,
    PushedStateToHistory = _require5.PushedStateToHistory;

var _require6 = require('./../events/exports'),
    ShowProgressEvent = _require6.ShowProgressEvent;

var TurboRedirected = function TurboRedirected(href, headers, _ref) {
  var progressBarClassName = _ref.progressBarClassName,
      ajaxFavicon = _ref.ajaxFavicon;

  _classCallCheck(this, TurboRedirected);

  var progressBar;

  if (progressBarClassName) {
    progressBar = document.createElement('progress');
    progressBar.setAttribute('class', progressBarClassName);
    progressBar.style.display = 'none';
    progressBar.max = 100;
    progressBar.value = 0;
    document.body.prepend(progressBar);
  }

  return new PushedStartStateToHistoryIfNeeded().after(new ChangedPageFavicon(document, ajaxFavicon, true).after(new ExtractedDocument(new StringFromBuffer(new ResponseBody(new ResponseFromAjaxRequest(new CreatedOptions('url', href, 'method', 'GET', 'headers', headers, 'progressEvent', new ShowProgressEvent(progressBar, true)))))).as('DOC').after(new BodyInnerHTMLOfDocument(as('DOC')).as('BODY').after(new TitleOfDocument(as('DOC')).as('TITLE').after(new FaviconOfDocument(as('DOC')).as('FAVICON').after(new PushedStateToHistory(new CreatedOptions('body', as('BODY'), 'title', as('TITLE'), 'favicon', as('FAVICON')), href).after(new ElementWithInnerHTML(document.body, as('BODY')).after(new ChangedPageTitle(document, as('TITLE')).after(new ChangedPageFavicon(document, as('FAVICON')))))))))));
};

module.exports = TurboRedirected;
