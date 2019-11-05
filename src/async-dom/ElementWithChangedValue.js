'use strict'

const { AsyncObject } = require('./../cutie/exports')

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
