'use strict'

const { AsyncObject } = require('./../cutie/exports')
const showdown = require('showdown')

class MarkdownConvertedToHTML extends AsyncObject {
  constructor (md, options) {
    super(md, options || {})
  }

  syncCall () {
    return (md, options) => {
      showdown.setFlavor('github')
      return new showdown.Converter(options).makeHtml(md)
    }
  }
}

module.exports = MarkdownConvertedToHTML
