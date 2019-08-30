'use strict'

const { browserified } = require('@page-libs/cutie')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ParsedJSON } = browserified(require('@cuties/json'))
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { UnwrappedChildrenOfParent, ElementWithInnerHTML } = require('@page-libs/dom')
const HTMLTunedElement = require('./../global-objects/HTMLTunedElement')

class EHTML extends HTMLTunedElement {
  constructor () {
    super()
    this.rendered = false
  }

  static get observedAttributes () {
    return ['data-src', 'data-headers']
  }

  attributesWithStorageVariables () {
    return ['data-src', 'data-headers']
  }

  render () {
    console.log('ok2')
    new UnwrappedChildrenOfParent(
      new ElementWithInnerHTML(
        this, new ResponseBody(
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
    ).call()
  }
}

module.exports = EHTML
