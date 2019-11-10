'use strict'

const E = require('./E')

class E_SELECT extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    this.replaceWithSelect()
    const value = this.node.getAttribute('value')
    for (let index = 0; index < this.node.options.length; index++) {
      const item = this.node.options.item(index)
      if (item.value === value) {
        this.node.selectedIndex = index
        break
      }
    }
  }

  replaceWithSelect () {
    const select = document.createElement('select')
    select.setAttribute('data-e-select', 'true')
    for (let i = 0; i < this.node.attributes.length; i++) {
      select.setAttribute(
        this.node.attributes[i].name,
        this.node.attributes[i].value
      )
    }
    while (this.node.firstChild) {
      const child = this.node.removeChild(this.node.firstChild)
      select.appendChild(child)
    }
    this.node.parentNode.replaceChild(select, this.node)
    this.node = select
  }
}

module.exports = E_SELECT
