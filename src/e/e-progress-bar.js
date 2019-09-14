'use strict'

const E = require('./../E')

class EProgressBar extends E {
  constructor () {
    super()
  }

  static get observedAttributes () {
    return [
      'data-background-url'
    ]
  }

  onRender () { }

  showProgress (event) {
    if (event.lengthComputable) {
      const percentComplete = parseInt((event.loaded / event.total) * 100)
      console.log('Download: ' + percentComplete + '% complete' + ' loaded: ' + event.loaded)
    }
  }
}

window.customElements.define('e-progress-bar', EProgressBar)

module.exports = EProgressBar
