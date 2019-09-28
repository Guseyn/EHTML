'use strict'

const { browserified } = require('@page-libs/cutie')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ParsedJSON } = browserified(require('@cuties/json'))
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { UnwrappedChildrenOfParent, ElementWithInnerHTML } = require('@page-libs/dom')
const E = require('./../E')

E(
  'e-html',
  class extends HTMLElement {
    constructor () {
      super()
    }

    onRender () {
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
)
