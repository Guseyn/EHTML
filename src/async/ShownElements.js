'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class ShownElms extends AsyncObject {
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

module.exports = ShownElms
