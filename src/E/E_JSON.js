'use strict'

const E = require('./E')
const { as } = require('./../cutie/exports')
const { FirstParsedElmSelector, PreparedProgressBar, ShownElement, HiddenElement } = require('./../async-dom/exports')
const { ResponseFromAjaxRequest, ResponseBody, ResponseHeaders, ResponseStatusCode, JSResponseByHTTPReponseComponents } = require('./../async-ajax/exports')
const { CreatedOptions } = require('./../async-object/exports')
const { ParsedJSON } = require('./../async-json/exports')
const { StringFromBuffer } = require('./../async-string/exports')
const { ShowProgressEvent } = require('./../events/exports')
const { AppliedActionsOnResponse } = require('./../actions/exports')

class E_JSON extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    new ShownElement(
      new FirstParsedElmSelector(
        this.node.getAttribute('data-ajax-icon')
      ).as('AJAX_ICON')
    ).after(
      new PreparedProgressBar(
        new FirstParsedElmSelector(
          this.node.getAttribute('data-progress-bar')
        )
      ).as('PROGRESS_BAR').after(
        new ResponseFromAjaxRequest(
          new CreatedOptions(
            'url', this.node.getAttribute('data-src'),
            'method', 'GET',
            'headers', new ParsedJSON(
              this.node.getAttribute('data-request-headers') || '{}'
            ),
            'progressEvent', new ShowProgressEvent(
              as('PROGRESS_BAR')
            )
          )
        ).as('RESPONSE').after(
          new HiddenElement(
            as('AJAX_ICON')
          ).after(
            new AppliedActionsOnResponse(
              this.node.tagName,
              this.node.getAttribute('data-response-name'),
              new JSResponseByHTTPReponseComponents(
                new ParsedJSON(
                  new StringFromBuffer(
                    new ResponseBody(
                      as('RESPONSE')
                    )
                  )
                ),
                new ResponseHeaders(
                  as('RESPONSE')
                ),
                new ResponseStatusCode(
                  as('RESPONSE')
                )
              ),
              this.node.getAttribute('data-actions-on-response')
            )
          )
        )
      )
    ).call()
  }
}

module.exports = E_JSON
