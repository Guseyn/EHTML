'use strict'

const { AsyncObject } = require('./../cutie/exports')

// Represented result is value
class Value extends AsyncObject {
  // path has signature: 'key1.key2.key3[0]'
  constructor (json, path) {
    super(json, path)
  }

  syncCall () {
    return (json, path) => {
      // eslint-disable-next-line no-eval
      return eval(`json.${path}`)
    }
  }
}

module.exports = Value
