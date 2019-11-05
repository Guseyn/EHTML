
'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ParsedJSONOrString extends AsyncObject {
  constructor (string) {
    super(string)
  }

  syncCall () {
    return (string) => {
      try {
        return JSON.parse(string)
      } catch (error) {
        return string
      }
    }
  }
}

module.exports = ParsedJSONOrString
