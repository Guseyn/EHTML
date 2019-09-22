'use strict'

const { browserified, as } = require('@page-libs/cutie')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ParsedJSON } = browserified(require('@cuties/json'))
const { StringFromBuffer } = browserified(require('@cuties/buffer'))
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { ElementWithInnerHTML } = require('@page-libs/dom')
const ExtractedDocument = require('./../async/ExtractedDocument')
const BodyInnerHTMLOfDocument = require('./../async/BodyInnerHTMLOfDocument')
const TitleOfDocument = require('./../async/TitleOfDocument')
const PushedStateToHistory = require('./../async/PushedStateToHistory')
const ChangedPageTitle = require('./../async/ChangedPageTitle')
const E = require('./../E')

if (!sessionStorage.getItem('isFirstStatePushedToHistory')) {
  sessionStorage.setItem('isFirstStatePushedToHistory', 'false')
}

window.onpopstate = (event) => {
  if (event.state) {
    document.body.innerHTML = event.state.body
    document.title = event.state.title
  }
}

window.onload = () => {
  if (sessionStorage.getItem('isFirstStatePushedToHistory') === 'false') {
    history.replaceState(
      {
        body: document.body.innerHTML,
        title: document.title
      },
      null,
      location.pathname + location.search
    )
    sessionStorage.setItem('isFirstStatePushedToHistory', 'true')
  }
}

class ETurboLink extends E {
  constructor () {
    super()
  }

  onRender () {
    this.addEventListener('click', () => {
      new ExtractedDocument(
        new StringFromBuffer(
          new ResponseBody(
            new ResponseFromAjaxRequest(
              new CreatedOptions(
                'url', this.getAttribute('data-href'),
                'method', 'GET',
                'headers', new ParsedJSON(
                  this.getAttribute('data-headers') || '{}'
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
            new PushedStateToHistory(
              new CreatedOptions(
                'body', as('BODY'),
                'title', as('TITLE')
              ),
              this.getAttribute('data-href')
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
      ).call()
    })
  }
}

window.customElements.define('e-turbolink', ETurboLink)

module.exports = ETurboLink
