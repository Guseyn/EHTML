'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class ElementsWithChangedClass extends AsyncObject {
  constructor (newClassName, elms) {
    super(newClassName, elms)
  }

  syncCall () {
    return (newClassName, elms) => {
      elms.forEach(elm => {
        elm.className = newClassName
      })
      return elms
    }
  }
}

module.exports = ElementsWithChangedClass
