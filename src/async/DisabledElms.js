'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class DisabledElms extends AsyncObject {
  constructor (...elmIds) {
    super(...elmIds)
  }

  syncCall () {
    return (elmIds) => {
      elmIds.forEach(elmId => {
        document.getElementById(elmId.split('#')[1]).setAttribute('disabled', true)
      })
    }
  }
}

module.exports = DisabledElms
