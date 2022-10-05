'use strict'

const { as } = require('./../cutie/exports')
const { StringFromBuffer } = require('./../async-string/exports')
const { ResponseFromAjaxRequest, ResponseBody } = require('./../async-ajax/exports')
const { CreatedOptions } = require('./../async-object/exports')
const { ReplacedElementWithAnotherOne, ExtractedDocument, BodyOfDocument, TitleOfDocument, FaviconOfDocument, ChangedPageTitle, ChangedPageFavicon, ShownElementAsBlock, HiddenElement, FirstParsedElmSelector } = require('./../async-dom/exports')
const { PushedStartStateToHistoryIfNeeded, PushedStateToHistory, UpdatedStateInHistory } = require('./../async-history/exports')

class TurboRedirected {
  constructor (href, headers, { progressBarPlace, progressBarClassName, ajaxIcon, ajaxFavicon }) {
    let progressBar
    return new PushedStartStateToHistoryIfNeeded(
      new CreatedOptions(
        'url', location.href,
        'headers', headers,
        'scrollY', window.pageYOffset || document.documentElement.scrollTop,
        'documentElementClientHeight', document.documentElement.clientHeight,
        'documentBodyClientHeight', document.body.clientHeight
      ), location.href
    ).after(
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
                  'progressEvent', () => {
                    if (progressBar) {
                      if (event.lengthComputable) {
                        const percentComplete = parseInt((event.loaded / event.total) * 100)
                        progressBar.value = percentComplete
                      }
                    }
                  },
                  'loadStartEvent', () => {
                    new ShownElementAsBlock(
                      new FirstParsedElmSelector(
                        ajaxIcon
                      )
                    ).call()
                    if (progressBarClassName) {
                      progressBar = document.createElement('progress')
                      progressBar.setAttribute('class', progressBarClassName)
                      progressBar.max = 100
                      progressBar.value = 0
                      if (progressBarPlace) {
                        document.querySelector(progressBarPlace).prepend(progressBar)
                      } else {
                        document.body.prepend(progressBar)
                      }
                    }
                  },
                  'loadEndEvent', () => {
                    if (progressBar) {
                      progressBar.parentNode.removeChild(progressBar)
                    }
                    new HiddenElement(
                      new FirstParsedElmSelector(
                        ajaxIcon
                      )
                    ).call()
                  }
                )
              )
            )
          )
        ).as('DOC').after(
          new BodyOfDocument(
            as('DOC')
          ).as('BODY').after(
            new TitleOfDocument(
              as('DOC')
            ).as('TITLE').after(
              new FaviconOfDocument(
                as('DOC')
              ).as('FAVICON').after(
                new UpdatedStateInHistory(
                  new CreatedOptions(
                    'url', location.href,
                    'headers', headers,
                    'scrollY', window.pageYOffset || document.documentElement.scrollTop,
                    'documentElementClientHeight', document.documentElement.clientHeight,
                    'documentBodyClientHeight', document.body.clientHeight
                  ),
                  location.href
                ).after(
                  new PushedStateToHistory(
                    new CreatedOptions(
                      'url', href,
                      'headers', headers
                    ),
                    href
                  ).after(
                    new ReplacedElementWithAnotherOne(
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
    )
  }
}

module.exports = TurboRedirected
