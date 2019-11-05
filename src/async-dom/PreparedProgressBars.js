'use strict'

const { AsyncObject } = require('./../cutie/exports')

class PreparedProgressBars extends AsyncObject {
  constructor (progressBars) {
    super(progressBars)
  }

  syncCall () {
    return (progressBars) => {
      for (let index = 0; index < progressBars.length; index++) {
        if (progressBars[index]) {
          const progressBar = progressBars[index]
          progressBar.max = 100
          progressBar.value = 0
          progressBar.style.display = 'none'
        }
      }
      return progressBars
    }
  }
}

module.exports = PreparedProgressBars
