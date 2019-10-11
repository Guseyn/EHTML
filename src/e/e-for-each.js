'use strict'

const E = require('./../E')

E(
  'e-for-each',
  class extends HTMLTemplateElement {
    constructor () {
      super()
    }

    onRender () {}
  },
  { extends: 'template' }
)
