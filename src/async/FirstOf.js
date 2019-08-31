'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class FirstOf extends AsyncObject {
  constructor (elms) {
    super(elms)
  }

  syncCall () {
    return (elms) => {
      return elms[0]
    }
  }
}

module.exports = FirstOf
