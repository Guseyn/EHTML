'use strict'

const { browserified } = require('@page-libs/cutie')
const { CreatedOptions, TheSameObjectWithValue } = browserified(require('@cuties/object'))
const { ParsedJSON } = browserified(require('@cuties/json'))
const { StringFromBuffer } = browserified(require('@cuties/buffer'))
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const HTMLTunedElement = require('./../global-objects/HTMLTunedElement')

class EJSON extends HTMLTunedElement {
  constructor () {
    super()
    this.values = {}
  }

  static get observedAttributes () {
    return [
      'data-src',
      'data-method',
      'data-headers',
      'data-request-body',
      'data-object'
    ]
  }

  attributesWithStorageVariables () {
    return [
      'data-src',
      'data-headers',
      'data-request-body'
    ]
  }

  supportedActions () {
    return [
      'redirect',
      'saveToLocalStorage',
      'saveToMemoryStorage',
      'innerHTML',
      'applyTextsAndValuesToChildNodes',
      'hideElms',
      'showElms',
      'disableElms',
      'enableElms',
      'changeElmsClassName'
    ]
  }

  render () {
    this.actions(
      new TheSameObjectWithValue(
        this.values,
        this.getAttribute('data-object'),
        new ParsedJSON(
          new StringFromBuffer(
            new ResponseBody(
              new ResponseFromAjaxRequest(
                new CreatedOptions(
                  'url', this.getAttribute('data-src'),
                  'method', this.getAttribute('data-method') || 'GET',
                  'headers', new ParsedJSON(
                    this.getAttribute('data-headers') || '{}'
                  )
                ),
                this.getAttribute('data-request-body')
              )
            )
          )
        )
      )
    ).call()
  }
}

module.exports = EJSON
