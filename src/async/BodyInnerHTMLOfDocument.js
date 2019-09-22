'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class BodyInnerHTMLOfDocument extends AsyncObject {
  constructor (doc) {
    super(doc)
  }

  syncCall () {
    return (doc) => {
      if (doc.body) {
        return doc.body.innerHTML
      }
      throw new Error('body element is missing in the html resource')
    }
  }
}

module.exports = BodyInnerHTMLOfDocument
