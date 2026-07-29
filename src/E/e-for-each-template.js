import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import setNodeScopedState from '#ehtml/setNodeScopedState.js'
import evaluatedValueWithParamsFromState from '#ehtml/evaluatedValueWithParamsFromState.js'

export default class EForEachTemplate extends HTMLTemplateElement {
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
    const listExpr = this.getAttribute('data-list-to-iterate')
    const itemName = this.getAttribute('data-item-name')
    const indexName = this.getAttribute('data-index-name') || 'index'

    if (!listExpr) {
      throw new Error('<template is="e-for-each"> must have data-list-to-iterate')
    }

    if (!itemName) {
      throw new Error('<template is="e-for-each"> must have data-item-name')
    }

    const state = getNodeScopedState(this)

    const list = evaluatedValueWithParamsFromState(
      listExpr.replace(/\n/g, ' '),
      state,
      this
    )

    if (!Array.isArray(list)) {
      console.log(list)
      throw new Error(`data-list-to-iterate must evaluate to an array, error from -> ${listExpr}`)
    }

    const fragment = document.createDocumentFragment()

    list.forEach((item, index) => {
      const cloned = this.content.cloneNode(true)

      const itemState = {
        ...state,
        [indexName]: index + 1,
        [itemName]: item
      }

      // Since `cloned` is a DocumentFragment of the template content,
      // we assign state to each root element in it.
      for (const child of cloned.childNodes) {
        if (child.nodeType === 1) {
          setNodeScopedState(child, itemState)
        }
      }

      fragment.appendChild(cloned)
    })

    // Replace <template> with generated DOM
    // MutationObserver will activate and process new nodes.
    this.replaceWith(fragment)
  }
}

customElements.define('e-for-each', EForEachTemplate, { extends: 'template' })
