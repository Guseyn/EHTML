'use strict'

const { AsyncObject } = require('./../cutie/exports')

class TitleOfDocument extends AsyncObject {
  constructor (doc) {
    super(doc)
  }

  syncCall () {
    return (doc) => {
      return doc.title
    }
  }
}

module.exports = TitleOfDocument
