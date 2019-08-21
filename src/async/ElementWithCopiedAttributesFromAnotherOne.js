'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class ElementWithCopiedAttributesFromAnotherOne extends AsyncObject {
  constructor (elm, elmToCopy) {
    super(elm, elmToCopy)
  }

  syncCall () {
    return (elm, elmToCopy) => {
      const elmAttrNamesToCopy = elmToCopy.getAttributeNames()
      elmAttrNamesToCopy.forEach(name => {
        elm.setAttribute(name, elmToCopy.getAttribute(name))
      })
      return elm
    }
  }
}

module.exports = ElementWithCopiedAttributesFromAnotherOne
