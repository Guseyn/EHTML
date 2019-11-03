'use strict'

const { AsyncObject } = require('./../cutie/exports')

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
