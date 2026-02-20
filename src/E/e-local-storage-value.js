import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js'

export default class ELocalStorageValue extends HTMLElement {
  constructor() {
    super()
    this.ehtmlActivated = false
  }

  connectedCallback() {
    this.addEventListener(
      'ehtml:activated',
      this.#onEHTMLActivated,
      { once: true }
    )
  }

  #onEHTMLActivated() {
    if (this.ehtmlActivated) {
      return
    }
    this.ehtmlActivated = true
    this.#run()
  }

  #run() {
    // exactly same behavior as before
    this.name = this.getAttribute('name')

    this.value = () => {
      const state = getNodeScopedState(this)
      return localStorage.getItem(
        evaluatedStringWithParamsFromState(
          this.getAttribute('data-key'),
          state,
          this
        )
      )
    }
  }
}

customElements.define('e-local-storage-value', ELocalStorageValue)
