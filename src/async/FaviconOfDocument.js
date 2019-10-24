'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class FaviconOfDocument extends AsyncObject {
  constructor (doc) {
    super(doc)
  }

  syncCall () {
    return (doc) => {
      if (doc.head) {
        const favicon = doc.head.querySelector("link[rel*='icon']")
        return favicon ? favicon.href : null
      }
      return null
    }
  }
}

module.exports = FaviconOfDocument
