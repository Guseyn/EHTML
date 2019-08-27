'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class ShownElms extends AsyncObject {
  constructor (...elmIds) {
    super(...elmIds)
  }

  syncCall () {
    return (elmIds) => {
      elmIds.forEach(elmId => {
        document.getElementById(elmId.split('#')[1]).style.display = ''
      })
    }
  }
}

module.exports = ShownElms
