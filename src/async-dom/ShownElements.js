'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ShownElements extends AsyncObject {
  constructor (elms) {
    super(elms)
  }

  syncCall () {
    return (elms) => {
      elms.forEach(elm => {
        elm.style.display = ''
      })
      return elms
    }
  }
}

module.exports = ShownElements
