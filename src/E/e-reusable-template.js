import templateTriggerEventListener from '#ehtml/templateTriggerEventListener.js'

export default class EReusableTemplate extends HTMLTemplateElement {
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
    this.addEventListener(
      'ehtml:template-triggered',
      this.#onEHTMLTemplateTriggered
    )
  }

  disconnectedCallback() {
    this.removeEventListener(
      'ehtml:template-triggered',
      this.#onEHTMLTemplateTriggered
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
    const releaseOnLoad = this.getAttribute('data-release-on-load') === 'true'
    if (!releaseOnLoad) {
      return
    }

    const state = {}
    if (this.hasAttribute('data-object-name')) {
      if (this.internalState) {
        state[this.getAttribute('data-object-name')] = this.internalState
      } else {
        state[this.getAttribute('data-object-name')] = {}
      }
    }

    this.#onEHTMLTemplateTriggered({
      target: this,
      detail: { state }
    })
  }

  #onEHTMLTemplateTriggered(event) {
    const template = event?.target ?? this
    const state = event?.detail?.state

    templateTriggerEventListener(template, state)
  }
}

customElements.define('e-reusable', EReusableTemplate, { extends: 'template' })
