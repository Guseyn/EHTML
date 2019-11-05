'use strict'

const { AsyncObject } = require('./../cutie/exports')

class EnabledElements extends AsyncObject {
  constructor (elms) {
    super(elms)
  }

  syncCall () {
    return (elms) => {
      elms.forEach(elm => {
        elm.removeAttribute('disabled')
      })
      return elms
    }
  }
}

module.exports = EnabledElements
