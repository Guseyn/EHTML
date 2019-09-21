'use strict'

const { AsyncObject } = require('@page-libs/cutie')

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
