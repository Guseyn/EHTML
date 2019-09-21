'use strict'

const { browserified } = require('@page-libs/cutie')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ParsedJSON } = browserified(require('@cuties/json'))
const { StringFromBuffer } = browserified(require('@cuties/buffer'))
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const AppliedActionsOnResponse = require('./../async/AppliedActionsOnResponse')
const E = require('./../E')

class EJSON extends E {
  constructor () {
    super()
  }

  static get observedAttributes () {
    return [
      'data-src',
      'data-headers',
      'data-response-object-name',
      'data-actions-on-response',
      'data-event'
    ]
  }

  supportedActions () {
    return [
      'redirect',
      'saveToLocalStorage',
      'saveToSessionStorage',
      'innerHTML',
      'addHTMLTo',
      'mapObjToElm',
      'hideElms',
      'showElms',
      'disableElms',
      'enableElms',
      'changeElmsClassName'
    ]
  }

  onRender () {
    const event = this.getAttribute('data-event')
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
      this.supportedActions(),
      new ParsedJSON(
        new StringFromBuffer(
          new ResponseBody(
            new ResponseFromAjaxRequest(
              new CreatedOptions(
                'url', this.getAttribute('data-src'),
                'method', 'GET',
                'headers', new ParsedJSON(
                  this.getAttribute('data-headers') || '{}'
                )
              )
            )
          )
        )
      )
    ).call()
  }
}

window.customElements.define('e-json', EJSON)

module.exports = EJSON
