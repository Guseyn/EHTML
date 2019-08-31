'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class ValidatedElementForMappingObject extends AsyncObject {
  constructor (elm) {
    super(elm)
  }

  syncCall () {
    return (elm) => {
      if (!elm.getAttribute('name') && !elm.getAttribute('data-object')) {
        throw new Error(`elm ${elm} must have attribute name, so you can know what object it encapsulates`)
      }
      return elm
    }
  }
}

module.exports = ValidatedElementForMappingObject
