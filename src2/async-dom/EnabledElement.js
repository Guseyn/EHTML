'use strict'

const { AsyncObject } = require('./../cutie/exports')

class EnabledElement extends AsyncObject {
  constructor (elm) {
    super(elm)
  }

  syncCall () {
    return (elm) => {
      if (elm) {
        elm.removeAttribute('disabled')
      }
      return elm
    }
  }
}

module.exports = EnabledElement
