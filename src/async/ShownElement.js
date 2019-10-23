'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class ShownElement extends AsyncObject {
  constructor (elm) {
    super(elm)
  }

  syncCall () {
    return (elm) => {
      if (elm) {
        elm.style.display = ''
      }
      return elm
    }
  }
}

module.exports = ShownElement
