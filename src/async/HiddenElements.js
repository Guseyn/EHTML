'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class HiddenElements extends AsyncObject {
  constructor (elms) {
    super(elms)
  }

  syncCall () {
    return (elms) => {
      elms.forEach(elm => {
        elm.style.display = 'none'
      })
      return elms
    }
  }
}

module.exports = HiddenElements
