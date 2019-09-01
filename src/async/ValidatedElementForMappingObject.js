'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class ValidatedElementForMappingObject extends AsyncObject {
  constructor (elm, commandName) {
    super(elm, commandName)
  }

  syncCall () {
    return (elm, commandName) => {
      if (!elm.getAttribute('data-object')) {
        throw new Error(`elm #${elm.getAttribute('id')} must have attribute data-object for ${commandName} action, so you can know what object it encapsulates`)
      }
      return elm
    }
  }
}

module.exports = ValidatedElementForMappingObject
