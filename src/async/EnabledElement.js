'use strict'

const { AsyncObject } = require('@page-libs/cutie')

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
