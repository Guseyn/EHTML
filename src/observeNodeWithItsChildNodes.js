import E from '#ehtml/E/exports.js'
import nodeIsNotForEHTML from '#ehtml/nodeIsNotForEHTML.js'
import observeNodeAttributes from '#ehtml/observeNodeAttributes.js'
import nodeName from '#ehtml/nodeName.js'
import updateEFormIfNeeded from '#ehtml/updateEFormIfNeeded.js'

function observeNodeWithItsChildNodes (node) {
  if (!node.isNotForEHTML && nodeIsNotForEHTML(node)) {
    node.isNotForEHTML = true
  }
  if (!node.attributesObservedByEHTML && !node.isNotForEHTML) {
    observeNodeAttributes(node)
    node.attributesObservedByEHTML = true
  }
  if (!node.observedByEHTML && !node.isNotForEHTML) {
    node.observedByEHTML = true
    const nodeNameValue = nodeName(node)
    if (E[nodeNameValue]) {
      if (!node.activatedByEHTML) {
        node.activatedByEHTML = true
        E[nodeNameValue](node)
      }
    } else if (window.__ehtmlCustomElements__[nodeNameValue]) {
      if (!node.activatedByEHTML) {
        node.activatedByEHTML = true
        window.__ehtmlCustomElements__[nodeNameValue](node)
      }
    }
    updateEFormIfNeeded(node, nodeNameValue)
    const childNodes = node.childNodes
    for (let i = 0; i < childNodes.length; i++) {
      observeNodeWithItsChildNodes(childNodes[i], i)
    }
    node.dispatchEvent(
      new Event('allChildNodesAreObservedByEHTML')
    )
  }
}

export default observeNodeWithItsChildNodes
