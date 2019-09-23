'use strict'

const { browserified, as } = require('@page-libs/cutie')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { StringFromBuffer } = browserified(require('@cuties/buffer'))
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { ElementWithInnerHTML } = require('@page-libs/dom')
const ExtractedDocument = require('./ExtractedDocument')
const BodyInnerHTMLOfDocument = require('./BodyInnerHTMLOfDocument')
const TitleOfDocument = require('./TitleOfDocument')
const PushedStateToHistory = require('./PushedStateToHistory')
const ChangedPageTitle = require('./ChangedPageTitle')

class TurboRedirected {
  constructor (href, headers) {
    return new ExtractedDocument(
      new StringFromBuffer(
        new ResponseBody(
          new ResponseFromAjaxRequest(
            new CreatedOptions(
              'url', href,
              'method', 'GET',
              'headers', headers
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
          new PushedStateToHistory(
            new CreatedOptions(
              'body', as('BODY'),
              'title', as('TITLE')
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
              )
            )
          )
        )
      )
    )
  }
}

module.exports = TurboRedirected
