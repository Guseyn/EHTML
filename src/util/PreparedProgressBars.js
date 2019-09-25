'use strict'

class PreparedProgressBars {
  constructor (progressBars) {
    this.progressBars = progressBars
  }

  value () {
    for (let index = 0; index < this.progressBars.length; index++) {
      if (this.progressBars[index]) {
        const progressBar = this.progressBars[index]
        progressBar.max = 100
        progressBar.value = 0
        progressBar.style.display = 'none'
      }
    }
    return this.progressBars
  }
}

module.exports = PreparedProgressBars
