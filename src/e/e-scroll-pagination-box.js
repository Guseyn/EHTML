'use strict'
/*
const { browserified, as } = require('@page-libs/cutie')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ParsedJSON } = browserified(require('@cuties/json'))
const { StringFromBuffer } = browserified(require('@cuties/buffer'))
const { ResponseFromAjaxRequest, ResponseBody, ResponseHeaders, ResponseStatusCode } = require('@page-libs/ajax')
const ShownElement = require('./../async/ShownElement')
const HiddenElement = require('./../async/HiddenElement')
const ElementWithMappedObject = require('./../async/ElementWithMappedObject')
const ParsedElmSelectors = require('./../util/ParsedElmSelectors')
const PreparedProgressBars = require('./../util/PreparedProgressBars')
const ShowProgressEvent = require('./../util/ShowProgressEvent')
const E = require('./../E')

E(
  'e-scroll-pagination-box',
  class extends HTMLDivElement {
    constructor () {
      super()
    }

    onRender () {
      this.page = this.getAttribute('data-start-page-number') * 1
      this.size = this.getAttribute('data-size-number') * 1
      this.progressBar = new PreparedProgressBars([
        new ParsedElmSelectors(
          this.getAttribute('data-progress-bar')
        ).value()[0]
      ]).value()[0]
      this.ajaxIcon = new ParsedElmSelectors(
        this.getAttribute('data-ajax-icon')
      ).value()[0]
      if (this.ajaxIcon) {
        this.ajaxIcon.style.display = 'none'
      }
      this.activate()
    }

    activate () {
      new ShownElement(
        this.ajaxIcon
      ).after(
        new ResponseFromAjaxRequest(
          new CreatedOptions(
            'url', this.getAttribute('data-src')
              .replace('${page}', this.page)
              .replace('${size}', this.size),
            'method', 'GET',
            'headers', new ParsedJSON(
              this.getAttribute('data-headers') || '{}'
            ),
            'progressEvent', new ShowProgressEvent(this.progressBar)
          )
        ).as('RESPONSE').after(
          new ElementWithMappedObject(
            this,
            new ParsedJSON(
              new StringFromBuffer(
                new ResponseBody(
                  as('RESPONSE')
                )
              )
            ),
            'data-response-object-name'
          ).after(
            new ElementWithMappedObject(
              this,
              new ResponseHeaders(
                as('RESPONSE')
              ),
              'data-response-object-name'
            ).after(

            )
          )
          new AppliedActionsOnResponse(
            this.tagName,
            this.getAttribute('data-response-object-name') || 'responseObject',
            new ParsedJSON(
              new StringFromBuffer(
                new ResponseBody(
                  as('RESPONSE')
                )
              )
            ),
            this.getAttribute('data-response-headers-name') || 'responseHeaders',
            new ResponseHeaders(
              as('RESPONSE')
            ),
            this.getAttribute('data-response-status-code-name') || 'responseStatusCode',
            new ResponseStatusCode(
              as('RESPONSE')
            ),
            `hideElms('${this.getAttribute('data-ajax-icon')}');`.concat(
              this.getAttribute('data-actions-on-response') || ''
            )
          )
        )
      ).call()
    }
  },
  { extends: 'div' }
)
*/
