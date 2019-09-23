'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class PushedStartStateToHistoryIfNeeded extends AsyncObject {
  constructor () {
    super()
  }

  syncCall () {
    return () => {
      const state = {
        body: document.body.innerHTML,
        title: document.title
      }
      if (sessionStorage.getItem('isFirstStatePushedToHistory') === 'false') {
        history.replaceState(
          state,
          null,
          location.pathname + location.search
        )
        sessionStorage.setItem('isFirstStatePushedToHistory', 'true')
      }
      return state
    }
  }
}

module.exports = PushedStartStateToHistoryIfNeeded
