'use strict'

class ESelect extends HTMLSelectElement {
  constructor () {
    super()
    this.rendered = false
  }

  connectedCallback () {
    setTimeout(() => {
      if (!this.rendered) {
        this.onRender()
        this.rendered = true
      }
    })
  }

  onRender () {
    this.value = this.getAttribute('value')
    for (let index = 0; index < this.options.length; index++) {
      const item = this.options.item(index)
      if (item.value === this.value) {
        this.selectedIndex = index
        break
      }
    }
  }
}

window.customElements.define('e-select', ESelect, { extends: 'select' })

module.exports = ESelect
