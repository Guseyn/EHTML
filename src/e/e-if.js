'use strict'

const E = require('./../E')

E(
  'e-if',
  class extends HTMLTemplateElement {
    constructor () {
      super()
    }

    onRender () {}
  },
  { extends: 'template' }
)
