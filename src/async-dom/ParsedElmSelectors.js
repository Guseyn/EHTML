'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ParsedElmSelectors extends AsyncObject {
  constructor (...elmSelectors) {
    super(...elmSelectors)
  }

  syncCall () {
    return (...elmSelectors) => {
      const elms = []
      elmSelectors.forEach(elmSelector => {
        if (elmSelector) {
          const elmsToPush = document.querySelectorAll(elmSelector)
          for (let i = 0; i < elmsToPush.length; i++) {
            elms.push(elmsToPush[i])
          }
        }
      })
      return elms
    }
  }
}

module.exports = ParsedElmSelectors
