'use strict'

const { AsyncObject } = require('./../cutie/exports')

// Represented result is object
class CreatedOptions extends AsyncObject {
  constructor (...args) {
    super(...args)
  }

  syncCall () {
    return (...args) => {
      let options = {}
      if (args.length % 2 !== 0) {
        throw new Error('odd number of parameters for options')
      }
      for (let i = 0; i < args.length - 1; i += 2) {
        options[args[i]] = args[i + 1]
      }
      return options
    }
  }
}

module.exports = CreatedOptions
