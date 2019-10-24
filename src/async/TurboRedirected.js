'use strict'

const { browserified, as } = require('@page-libs/cutie')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { StringFromBuffer } = browserified(require('@cuties/buffer'))
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { ElementWithInnerHTML } = require('@page-libs/dom')
const PushedStartStateToHistoryIfNeeded = require('./PushedStartStateToHistoryIfNeeded')
const ExtractedDocument = require('./ExtractedDocument')
const BodyInnerHTMLOfDocument = require('./BodyInnerHTMLOfDocument')
const TitleOfDocument = require('./TitleOfDocument')
const FaviconOfDocument = require('./FaviconOfDocument')
const PushedStateToHistory = require('./PushedStateToHistory')
const ChangedPageTitle = require('./ChangedPageTitle')
const ChangedPageFavicon = require('./ChangedPageFavicon')
const ShowProgressEvent = require('./../util/ShowProgressEvent')

class TurboRedirected {
  constructor (href, headers, { progressBarClassName, ajaxFavicon }) {
    let progressBar
    if (progressBarClassName) {
      progressBar = document.createElement('progress')
      progressBar.setAttribute('class', progressBarClassName)
      progressBar.style.display = 'none'
      progressBar.max = 100
      progressBar.value = 0
      document.body.prepend(progressBar)
    }
    return new PushedStartStateToHistoryIfNeeded().after(
      new ChangedPageFavicon(
        document, ajaxFavicon, true
      ).after(
        new ExtractedDocument(
          new StringFromBuffer(
            new ResponseBody(
              new ResponseFromAjaxRequest(
                new CreatedOptions(
                  'url', href,
                  'method', 'GET',
                  'headers', headers,
                  'progressEvent', new ShowProgressEvent(
                    progressBar, true
                  )
                )
              )
            )
          )
        ).as('DOC').after(
          new BodyInnerHTMLOfDocument(
            as('DOC')
          ).as('BODY').after(
            new TitleOfDocument(
              as('DOC')
            ).as('TITLE').after(
              new FaviconOfDocument(
                as('DOC')
              ).as('FAVICON').after(
                new PushedStateToHistory(
                  new CreatedOptions(
                    'body', as('BODY'),
                    'title', as('TITLE'),
                    'favicon', as('FAVICON')
                  ),
                  href
                ).after(
                  new ElementWithInnerHTML(
                    document.body,
                    as('BODY')
                  ).after(
                    new ChangedPageTitle(
                      document,
                      as('TITLE')
                    ).after(
                      new ChangedPageFavicon(
                        document,
                        as('FAVICON')
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  }
}

module.exports = TurboRedirected
