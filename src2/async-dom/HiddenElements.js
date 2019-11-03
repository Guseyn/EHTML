'use strict'

const { AsyncObject } = require('./../cutie/exports')

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
