'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class FaviconOfDocument extends AsyncObject {
  constructor (doc) {
    super(doc)
  }

  syncCall () {
    return (doc) => {
      if (doc.head) {
        return doc.head.querySelector("link[rel*='icon']").href
      }
      return null
    }
  }
}

module.exports = FaviconOfDocument
