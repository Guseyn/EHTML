'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class DisabledElement extends AsyncObject {
  constructor (elm) {
    super(elm)
  }

  syncCall () {
    return (elm) => {
      if (elm) {
        elm.setAttribute('disabled', true)
      }
      return elm
    }
  }
}

module.exports = DisabledElement
