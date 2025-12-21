import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import evaluatedValueWithParamsFromState from '#ehtml/evaluatedValueWithParamsFromState.js'

export default class EIfTemplate extends HTMLTemplateElement {
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
    const expr = this.getAttribute('data-condition-to-display')
    if (!expr) {
      throw new Error(`<template is="e-if"> must have data-condition-to-display`)
    }

    // 1. Get inherited lexical state at this <template>
    const state = getNodeScopedState(this)

    // 2. Evaluate the list expression (JSON string)
    const evaluated = evaluatedValueWithParamsFromState(
      expr.replace(/\n/g, ' '),
      state,
      this
    )

    const show = evaluated === true || evaluated === 'true'

    if (show) {
      this.insertContent()
    } else {
      this.remove()
    }
  }

  insertContent() {
    // Clone the <template> content
    const fragment = this.content.cloneNode(true)
    const parent = this.parentNode
    parent.insertBefore(fragment, this)
    parent.replaceChild(fragment, this)
  }
}

customElements.define('e-if', EIfTemplate, { extends: 'template' })
