'use strict'

const { AsyncObject } = require('./../cutie/exports')

class First extends AsyncObject {
  constructor (array) {
    super(array)
  }

  syncCall () {
    return (array) => {
      return array[0] || null
    }
  }
}

module.exports = First
