
'use strict'

const { AsyncObject } = require('./../cutie/exports')

class UpdatedStateInHistory extends AsyncObject {
  constructor (state, href) {
    super(state, href)
  }

  syncCall () {
    return (state, href) => {
      history.replaceState(state, null, href)
      return state
    }
  }
}

module.exports = UpdatedStateInHistory
