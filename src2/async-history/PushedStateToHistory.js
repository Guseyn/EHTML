
'use strict'

const { AsyncObject } = require('./../cutie/exports')

class PushedStateToHistory extends AsyncObject {
  constructor (state, href) {
    super(state, href)
  }

  syncCall () {
    return (state, href) => {
      history.pushState(state, null, href)
      return state
    }
  }
}

module.exports = PushedStateToHistory
