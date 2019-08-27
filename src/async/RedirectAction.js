'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class RedirectAction extends AsyncObject {
  constructor (url) {
    super(url)
  }

  syncCall () {
    return (url) => {
      window.location.href = url
    }
  }
}

module.exports = RedirectAction
