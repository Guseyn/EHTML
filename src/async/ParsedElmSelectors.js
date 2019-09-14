'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const ParsedElmSelectors = require('./../util/ParsedElmSelectors')

class AsyncParsedElmSelectors extends AsyncObject {
  constructor (...elmSelectors) {
    super(...elmSelectors)
  }

  syncCall () {
    return (...elmSelectors) => {
      return new ParsedElmSelectors(...elmSelectors).value()
    }
  }
}

module.exports = AsyncParsedElmSelectors
