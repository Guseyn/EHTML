import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import setNodeScopedState from '#ehtml/setNodeScopedState.js'
import evaluatedValueWithParamsFromState from '#ehtml/evaluatedValueWithParamsFromState.js'

export default class EForEachTemplate extends HTMLTemplateElement {
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
    const listExpr = this.getAttribute('data-list-to-iterate')
    const itemName = this.getAttribute('data-item-name')

    if (!listExpr) {
      throw new Error('<template is="e-for-each"> must have data-list-to-iterate')
    }

    if (!itemName) {
      throw new Error('<template is="e-for-each"> must have data-item-name')
    }

    // 1. Get inherited lexical state at this <template>
    const state = getNodeScopedState(this)

    // 2. Evaluate the list expression
    const list = evaluatedValueWithParamsFromState(
      listExpr.replace(/\n/g, ' '),
      state,
      this
    )

    if (!Array.isArray(list)) {
      throw new Error('data-list-to-iterate must evaluate to an array')
    }

    // 3. Prepare fragment to insert
    const fragment = document.createDocumentFragment()

    list.forEach((item, index) => {
      // Add index if not set
      if (typeof item === 'object' && item.index === undefined) {
        item.index = index + 1
      }

      // Clone inert DOM from template
      const cloned = this.content.cloneNode(true)

      // 4. Build item-level state (lexical extension)
      const itemState = {
        ...state,
        [itemName]: item
      }

      // 5. Assign the new lexical state to this *iteration wrapper*
      //
      // Since `cloned` is a DocumentFragment of the template content,
      // we assign state to each root element in it.
      for (const child of cloned.childNodes) {
        if (child.nodeType === 1) {
          setNodeScopedState(child, itemState)
        }
      }

      fragment.appendChild(cloned)
    })

    // 6. Replace <template> with generated DOM
    // MutationObserver will activate and process new nodes.
    this.replaceWith(fragment)
  }
}

customElements.define('e-for-each', EForEachTemplate, { extends: 'template' })
