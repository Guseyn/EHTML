'use strict'

const { browserified } = require('@page-libs/cutie')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ParsedJSON } = browserified(require('@cuties/json'))
const { StringFromBuffer } = browserified(require('@cuties/buffer'))
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const AppliedActionsOnResponse = require('./../async/AppliedActionsOnResponse')
const ParsedElmSelectors = require('./../util/ParsedElmSelectors')
const PreparedProgressBars = require('./../util/PreparedProgressBars')
const ShowProgressEvent = require('./../util/ShowProgressEvent')
const E = require('./../E')

E(
  'e-json',
  class extends HTMLElement {
    constructor () {
      super()
    }

    onRender () {
      const event = this.getAttribute('data-event')
      this.progressBar = new PreparedProgressBars([
        new ParsedElmSelectors(
          this.getAttribute('data-progress-bar')
        ).value()[0]
      ]).value()[0]
      if (event) {
        this.addEventListener(event, this.activate)
      } else {
        this.activate()
      }
    }

    activate () {
      new AppliedActionsOnResponse(
        this.tagName,
        this.getAttribute('data-response-object-name'),
        this.getAttribute('data-actions-on-response'),
        new ParsedJSON(
          new StringFromBuffer(
            new ResponseBody(
              new ResponseFromAjaxRequest(
                new CreatedOptions(
                  'url', this.getAttribute('data-src'),
                  'method', 'GET',
                  'headers', new ParsedJSON(
                    this.getAttribute('data-headers') || '{}'
                  ),
                  'progressEvent', new ShowProgressEvent(this.progressBar)
                )
              )
            )
          )
        )
      ).call()
    }
  }
)
