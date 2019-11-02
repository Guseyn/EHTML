'use strict'

const Template = require('./Template')
const { UnwrappedTemplate, ElementWithInnerHTML } = require('./../async-dom/exports')
const { ResponseBody, ResponseFromAjaxRequest, CreatedOptions } = require('./../async-ajax/exports')
const { ParsedJSON } = require('./../async-json/exports')

class HTMLTemplate extends Template {
  constructor (node) {
    super(node)
  }

  activate () {
    new UnwrappedTemplate(
      new ElementWithInnerHTML(
        this.node,
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
        )
      )
    ).call()
  }
}

module.exports = HTMLTemplate
