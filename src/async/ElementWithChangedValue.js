'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class ElementWithChangedValue extends AsyncObject {
  constructor (elm, newValue) {
    super(elm, newValue)
  }

  syncCall () {
    return (elm, newValue) => {
      elm.value = newValue
      return elm
    }
  }
}

module.exports = ElementWithChangedValue
