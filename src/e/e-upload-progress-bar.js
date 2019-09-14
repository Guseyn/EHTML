'use strict'

const E = require('./../E')

class EUploadProgressBar extends E {
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
      console.log('Upload: ' + percentComplete + '% complete' + ' loaded: ' + event.loaded)
    }
  }
}

window.customElements.define('e-upload-progress-bar', EUploadProgressBar)

module.exports = EUploadProgressBar
