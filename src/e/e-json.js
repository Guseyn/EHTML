'use strict'

const { browserified } = require('@page-libs/cutie')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ParsedJSON } = browserified(require('@cuties/json'))
const { StringFromBuffer } = browserified(require('@cuties/buffer'))
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const AppliedActions = require('./../async/AppliedActions')
const E = require('./../E')

class EJSON extends E {
  constructor () {
    super()
  }

  static get observedAttributes () {
    return [
      'data-request-url',
      'data-request-method',
      'data-request-headers',
      'data-request-body',
      'data-object',
      'data-actions',
      'data-event'
    ]
  }

  supportedActions () {
    return [
      'redirect',
      'saveToLocalStorage',
      'saveToMemoryStorage',
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
    const event = this.attr('data-event')
    if (event) {
      this.addEventListener(event, this.activate)
    } else {
      this.activate()
    }
  }

  activate () {
    new AppliedActions(
      this.tagName,
      this.attr('data-object'),
      this.attr('data-actions'),
      this.supportedActions(),
      new ParsedJSON(
        new StringFromBuffer(
          new ResponseBody(
            new ResponseFromAjaxRequest(
              new CreatedOptions(
                'url', this.attr('data-request-url'),
                'method', this.attr('data-request-method') || 'GET',
                'headers', new ParsedJSON(
                  this.attr('data-request-headers') || '{}'
                )
              ),
              this.attr('data-request-body')
            )
          )
        )
      )
    ).call()
  }
}

window.customElements.define('e-json', EJSON)

module.exports = EJSON
