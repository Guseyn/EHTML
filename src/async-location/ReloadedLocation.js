'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ReloadedLocation extends AsyncObject {
  constructor () {
    super()
  }

  syncCall () {
    return () => {
      window.location.reload()
    }
  }
}

module.exports = ReloadedLocation
