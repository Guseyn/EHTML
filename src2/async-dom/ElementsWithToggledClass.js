'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ElementsWithToggledClass extends AsyncObject {
  constructor (className, elms) {
    super(className, elms)
  }

  syncCall () {
    return (className, elms) => {
      elms.forEach(elm => {
        elm.classList.toggle(className)
      })
      return elms
    }
  }
}

module.exports = ElementsWithToggledClass
