'use strict'

const { AsyncObject } = require('@cuties/cutie')

global.Node = {
  TEXT_NODE: 'text',
  NO_TEXT_NODE: 'no_text'
}

global.window = {
  localStorage: {
    getItem: (key) => {
      return key
    }
  }
}
