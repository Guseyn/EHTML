'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ShownElementAsBlock extends AsyncObject {
  constructor (elm) {
    super(elm)
  }

  syncCall () {
    return (elm) => {
      if (elm) {
        elm.style.display = 'block'
      }
      return elm
    }
  }
}

module.exports = ShownElementAsBlock
