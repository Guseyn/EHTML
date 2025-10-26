import E from 'ehtml/E/exports'
import nodeIsNotForEHTML from 'ehtml/nodeIsNotForEHTML'
import observeNodeAttributes from 'ehtml/observeNodeAttributes'
import nodeName from 'ehtml/nodeName'

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
