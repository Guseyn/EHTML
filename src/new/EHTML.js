'use strict'

const { browserified } = require('@page-libs/cutie')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ParsedJSON } = browserified(require('@cuties/json'))
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { UnwrappedChildrenOfParent, ElementWithInnerHTML } = require('@page-libs/dom')
const EElement = require('./EElement')

class EHTML extends HTMLElement {
  constructor () {
    super()
    this.elm = new EElement(this, [ 'data-src', 'data-headers' ], [])
  }

  static get observedAttributes () {
    return this.elm.observedAttributes
  }

  connectedCallback () {
    this.elm.connectedCallback(() => {
      new UnwrappedChildrenOfParent(
        new ElementWithInnerHTML(
          this.elm, new ResponseBody(
            new ResponseFromAjaxRequest(
              new CreatedOptions(
                'url', this.elm.attrValue('data-src'),
                'method', 'GET',
                'headers', new ParsedJSON(
                  this.elm.attrValue('data-headers') || '{}'
                )
              )
            )
          )
        )
      ).after(
        this.elm.appliedActions()
      ).call()
    })
  }
}

window.customElements.define('e-html', EHTML)

module.exports = EHTML
