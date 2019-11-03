'use strict'

const { AsyncObject } = require('./../cutie/exports')

class PushedStartStateToHistoryIfNeeded extends AsyncObject {
  constructor () {
    super()
  }

  syncCall () {
    return () => {
      const favicon = document.querySelector("link[rel*='icon']")
      const state = {
        body: document.body.innerHTML,
        title: document.title,
        favicon: favicon ? favicon.href : null
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
