'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class EnabledElms extends AsyncObject {
  constructor (...elmIds) {
    super(...elmIds)
  }

  syncCall () {
    return (elmIds) => {
      elmIds.forEach(elmId => {
        document.getElementById(elmId.split('#')[1]).removeAttribute('disabled')
      })
    }
  }
}

module.exports = EnabledElms
