import isCustomElement from '#ehtml/isCustomElement.js'
import processAttributes from '#ehtml/processAttributes.js'
import shouldSkipNode from '#ehtml/shouldSkipNode.js'
import isTemplate from '#ehtml/isTemplate.js'
import templateTriggerEventListener from '#ehtml/templateTriggerEventListener.js'

export default function activateNode(node) {

  if (!(node instanceof Element)) {
    return
  }

  if (shouldSkipNode(node)) {
    return
  }

  // 1. Process attributes ONLY on this node (only once)
  if (!node.ehtmlAttributesProcessed) {
    processAttributes(node)
    node.ehtmlAttributesProcessed = true
  }

  // 2. Activate custom element—exactly once
  if (isCustomElement(node)) {
    if (!node.ehtmlActivated) {
      node.dispatchEvent(
        new CustomEvent('ehtml:activated', {
          bubbles: false,
          detail: { state: {} }
        })
      )
    }
  }

  // 3. Native <template> (NO "is") — attach template-trigger listener once
  if (isTemplate(node) && !node.getAttribute('is')) {    
    if (!node.ehtmlTemplateTriggerEventListenerAttached) {
      node.ehtmlTemplateTriggerEventListenerAttached = true
      if (node.hasAttribute('data-release-on-load')) {
        if (!node.hasAttribute('data-object-name')) {
          throw new Error('template must have "data-object-name" attribute if you want to map/release it')
        }
        const state = {}
        if (node.internalState) {
          state[node.getAttribute('data-object-name')] = node.internalState
        } else {
          state[node.getAttribute('data-object-name')] = {}
        }
        templateTriggerEventListener(
          node, state
        )
        // Remove template after triggering it,
        // since it's not e-reusable
        if (node.parentNode) {
          node.parentNode.removeChild(node)
        }
      } else {
        node.addEventListener(
          'ehtml:template-triggered',
          (event) => {
            templateTriggerEventListener(
              event.target,
              event.detail.state
            )
            // Remove template after triggering it,
            // since it's not e-reusable
            if (event.target.parentNode) {
              event.target.parentNode.removeChild(event.target)
            }
          },
          { once: true }
        )
      }
    }
  }

  // 4. Activate children (only one level deep)
  if (node.childNodes) {
    for (const child of node.childNodes) {
      activateNode(child)
    }
  }
}
