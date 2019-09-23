'use strict'

const { browserified } = require('@page-libs/cutie')
const { ParsedJSON } = browserified(require('@cuties/json'))
const TurboRedirected = require('./../async/TurboRedirected')
const E = require('./../E')

class ETurboLink extends E {
  constructor () {
    super()
  }

  onRender () {
    this.addEventListener('click', () => {
      new TurboRedirected(
        this.getAttribute('data-href'),
        new ParsedJSON(
          this.getAttribute('data-headers') || '{}'
        )
      ).call()
    })
  }
}

window.customElements.define('e-turbolink', ETurboLink)

module.exports = ETurboLink
