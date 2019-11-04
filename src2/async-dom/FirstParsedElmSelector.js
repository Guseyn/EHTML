'use strict'

const { AsyncObject } = require('./../cutie/exports')

class FirstParsedElmSelector extends AsyncObject {
  constructor (elmSelector) {
    super(elmSelector)
  }

  syncCall () {
    return (elmSelector) => {
      return document.querySelector(elmSelector)
    }
  }
}

module.exports = FirstParsedElmSelector
