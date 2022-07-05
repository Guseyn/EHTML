'use strict'

const E = require('./E')
const { UnwrappedChildrenOfParent, ElementWithInnerHTML } = require('./../async-dom/exports')
const { ResponseFromAjaxRequest, ResponseBody } = require('./../async-ajax/exports')
const { CreatedOptions } = require('./../async-object/exports')
const { ParsedJSON } = require('./../async-json/exports')
const { MarkdownConvertedToHTML } = require('./../async-md/exports')

class E_MARKDOWN extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    new UnwrappedChildrenOfParent(
      new ElementWithInnerHTML(
        this.node,
        new MarkdownConvertedToHTML(
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
          {
            tables: true,
            tasklists: true,
            simpleLineBreaks: true,
            emoji: true,
            moreStyling: true,
            github: true
          }
        )
      )
    ).call()
  }
}

module.exports = E_MARKDOWN
