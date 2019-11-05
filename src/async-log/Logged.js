'use strict'

const { AsyncObject } = require('./../cutie/exports')

class Logged extends AsyncObject {
  constructor (...objs) {
    super(...objs)
  }

  syncCall () {
    return (...objs) => {
      console.log(...objs)
      return objs
    }
  }
}

module.exports = Logged
