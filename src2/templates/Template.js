'use strict'

class Template {
  constructor (node) {
    this.node = node
  }

  activate () {
    throw new Error('activate function must be defined')
  }
}

module.exports = Template
