'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ElementWithChangedAttribute extends AsyncObject {
  constructor (elm, attrName, attrValue) {
    super(elm, attrName, attrValue)
  }

  syncCall () {
    return (elm, attrName, attrValue) => {
      elm.setAttribute(attrName, attrValue)
      return elm
    }
  }
}

module.exports = ElementWithChangedAttribute
