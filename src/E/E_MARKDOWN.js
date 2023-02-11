'use strict'

const E = require('./E')
const { UnwrappedChildrenOfParent, ElementWithInnerHTML } = require('./../async-dom/exports')
const { ResponseFromAjaxRequest, ResponseBody } = require('./../async-ajax/exports')
const { CreatedOptions } = require('./../async-object/exports')
const { ParsedJSON } = require('./../async-json/exports')
const { MarkdownConvertedToHTML } = require('./../async-md/exports')

const showdownHighlight = require('showdown-highlight')

class E_MARKDOWN extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    const extensions = []
    if (this.node.getAttribute('data-apply-code-highlighting')) {
      extensions.push(
        showdownHighlight({
          // Whether to add the classes to the <pre> tag, default is false
          pre: true,
          // Whether to use hljs' auto language detection, default is true
          auto_detection: true
        })
      )
    }
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
            github: true,
            extensions: extensions
          }
        )
      )
    ).call()
  }
}

module.exports = E_MARKDOWN
