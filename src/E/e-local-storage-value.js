export default class ELocalStorageValue extends HTMLElement {
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

  __setup() {
    // exactly same behavior as before
    this.name = this.getAttribute('name')

    this.value = () => {
      return localStorage.getItem(
        this.getAttribute('data-key')
      )
    }
  }
}

customElements.define('e-local-storage-value', ELocalStorageValue)
