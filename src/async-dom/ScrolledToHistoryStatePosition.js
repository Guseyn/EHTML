'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ScrolledToHistoryStatePosition extends AsyncObject {
  constructor () {
    super()
  }

  syncCall () {
    return () => {
      if (
        window.history.state &&
        (window.history.state.documentBodyClientHeight !== undefined) &&
        (history.state.scrollY !== undefined)
      ) {
        document.body.style.height = `${window.history.state.documentBodyClientHeight}px`
        window.scrollTo(0, history.state.scrollY)
      }
    }
  }
}

module.exports = ScrolledToHistoryStatePosition
