'use strict'

const { AsyncObject } = require('./../cutie/exports')

// Represented result is obj
class TheSameObjectWithValue extends AsyncObject {
  constructor (obj, key, value) {
    super(obj, key, value)
  }

  syncCall () {
    return (obj, key, value) => {
      obj[key] = value
      return obj
    }
  }
}

module.exports = TheSameObjectWithValue
