'use strict'

const { AsyncObject } = require('./../cutie/exports')

class HeadOfDocument extends AsyncObject {
  constructor (doc) {
    super(doc)
  }

  syncCall () {
    return (doc) => {
      if (doc.head) {
        return doc.head
      }
      return null
    }
  }
}

module.exports = HeadOfDocument
