'use strict'

// const StringWithMappedObject = require('./../util/StringWithMappedObject')

const E = require('./../E')

E(
  'e-for-each',
  class extends HTMLElement {
    constructor () {
      super()
    }

    onRender () {}

    apply () {
      this.removeAttribute('hidden')
    }
  }
)
