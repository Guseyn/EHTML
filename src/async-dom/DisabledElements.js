'use strict'

const { AsyncObject } = require('./../cutie/exports')

class DisabledElements extends AsyncObject {
  constructor (elms) {
    super(elms)
  }

  syncCall () {
    return (elms) => {
      elms.forEach(elm => {
        elm.setAttribute('disabled', true)
      })
    }
  }
}

module.exports = DisabledElements
