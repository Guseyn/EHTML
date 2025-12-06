export default class ESelect extends HTMLSelectElement {
  constructor() {
    super()
    this.ehtmlActivated = false
  }

  connectedCallback() {
    this.addEventListener('ehtml:activated', this.onEHTMLActivated, { once: true })
  }

  onEHTMLActivated() {
    if (this.ehtmlActivated) {
      return
    }
    this.ehtmlActivated = true
    this.run()
  }

  // ─────────────────────────────────────────────
  //  Apply "value" attribute to select options
  // ─────────────────────────────────────────────
  run() {
    const value = this.getAttribute('value')

    if (value === null) {
      return
    }

    for (let i = 0; i < this.options.length; i++) {
      const opt = this.options.item(i)
      if (opt.value === value) {
        opt.selected = true
        break
      }
    }
  }
}

customElements.define('e-select', ESelect, { extends: 'select' })
