'use strict'

const { AsyncObject } = require('./../cutie/exports')

class RemovedElements extends AsyncObject {
  constructor (elms) {
    super(elms)
  }

  syncCall () {
    return (elms) => {
      elms.forEach(elm => {
        elm.parentNode.removeChild(elm)
      })
      return elms
    }
  }
}

module.exports = RemovedElements
