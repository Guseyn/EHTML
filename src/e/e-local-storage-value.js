'use strict'

const E = require('./../E')

E(
  'e-local-storage-value',
  class extends HTMLElement {
    constructor () {
      super()
    }

    onRender () {
      this.name = this.getAttribute('name')
    }

    value () {
      return localStorage.getItem(
        this.getAttribute('data-key')
      )
    }
  }
)
