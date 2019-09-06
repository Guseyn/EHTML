'use strict'

const HTMLTunedElement = require('./../global-objects/HTMLTunedElement')

class EUploadProgressBar extends HTMLTunedElement {
  constructor () {
    super()
  }

  static get observedAttributes () {
    return [
      'data-background-url'
    ]
  }

  supportedActions () {
    return [ ]
  }

  render () {
    this.appliedActions().call()
  }

  showProgress (event) {
    if (event.lengthComputable) {
      const percentComplete = parseInt((event.loaded / event.total) * 100)
      console.log('Upload: ' + percentComplete + '% complete' + ' loaded: ' + event.loaded)
    }
  }
}

module.exports = EUploadProgressBar
