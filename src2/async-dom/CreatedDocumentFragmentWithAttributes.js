'use strict'

const { DocumentFragmentWithAttributes } = require('./../dom/exports')
const { AsyncObject } = require('./../cutie/exports')

class CreatedDocumentFragmentWithAttributes extends AsyncObject {
  constructor (fragment, attributes) {
    super(fragment, attributes)
  }

  syncCall () {
    return (fragment, attributes) => {
      return new DocumentFragmentWithAttributes(fragment, attributes)
    }
  }
}

module.exports = CreatedDocumentFragmentWithAttributes
