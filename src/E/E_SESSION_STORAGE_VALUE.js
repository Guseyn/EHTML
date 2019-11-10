'use strict'

const E = require('./E')

class E_SESSION_STORAGE_VALUE extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    this.node.name = this.node.getAttribute('name')
    this.node.value = () => {
      return sessionStorage.getItem(
        this.node.getAttribute('data-key')
      )
    }
  }
}

module.exports = E_SESSION_STORAGE_VALUE
