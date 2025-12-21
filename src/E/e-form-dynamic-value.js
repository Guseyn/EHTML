import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js'

export default class EFormDynamicValue extends HTMLElement {
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

  run() {
    this.style.display = 'none'
    this.name = this.getAttribute('name')
    const state = getNodeScopedState(this)
    this.value = () => {
      return evaluatedStringWithParamsFromState(
        this.getAttribute('data-bound-to'),
        state,
        this
      )
    }
  }
}

customElements.define('e-form-dynamic-value', EFormDynamicValue)
