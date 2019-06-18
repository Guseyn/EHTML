'use strict'

const { AsyncObject } = require('@cuties/cutie')

global.window = {
  localStorage: {
    getItem: (key) => {
      return key
    }
  }
}
