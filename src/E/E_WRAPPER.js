'use strict'

const E = require('./E')
const { ReleasedWrapperTemplateWithInnerContent } = require('./../async-dom/exports')
const { ResponseFromAjaxRequest, ResponseBody } = require('./../async-ajax/exports')
const { CreatedOptions } = require('./../async-object/exports')
const { ParsedJSON } = require('./../async-json/exports')

class E_WRAPPER extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    new ReleasedWrapperTemplateWithInnerContent(
      new ResponseBody(
        new ResponseFromAjaxRequest(
          new CreatedOptions(
            'url', this.node.getAttribute('data-src'),
            'method', 'GET',
            'headers', new ParsedJSON(
              this.node.getAttribute('data-headers') || '{}'
            )
          )
        )
      ),
      this.node
    ).call()
  }
}

module.exports = E_WRAPPER
