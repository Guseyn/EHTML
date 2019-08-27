'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class HiddenElms extends AsyncObject {
  constructor (...elmIds) {
    super(...elmIds)
  }

  syncCall () {
    return (elmIds) => {
      elmIds.forEach(elmId => {
        document.getElementById(elmId.split('#')[1]).style.display = 'none'
      })
    }
  }
}

module.exports = HiddenElms
