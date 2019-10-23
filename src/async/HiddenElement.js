'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class HiddenElement extends AsyncObject {
  constructor (elm) {
    super(elm)
  }

  syncCall () {
    return (elm) => {
      if (elm) {
        elm.style.display = 'none'
      }
      return elm
    }
  }
}

module.exports = HiddenElement
