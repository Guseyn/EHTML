'use strict'

const { browserified } = require('@page-libs/cutie')
const { ParsedJSON } = browserified(require('@cuties/json'))
const TurboRedirected = require('./../async/TurboRedirected')
const E = require('./../E')

E(
  'e-turbolink',
  class extends HTMLElement {
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
)
