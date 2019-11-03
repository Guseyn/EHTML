'use strict'

const { AsyncObject } = require('./../cutie/exports')

class PreparedProgressBar extends AsyncObject {
  constructor (progressBar) {
    super(progressBar)
  }

  syncCall () {
    return (progressBar) => {
      if (progressBar) {
        progressBar.max = 100
        progressBar.value = 0
        progressBar.style.display = 'none'
        return progressBar
      }
      return null
    }
  }
}

module.exports = PreparedProgressBar
