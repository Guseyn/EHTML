import E from '#ehtml/E/exports.js?v=6e563378'
import nodeIsNotForEHTML from '#ehtml/nodeIsNotForEHTML.js?v=c6f93764'
import observeNodeAttributes from '#ehtml/observeNodeAttributes.js?v=c22a1391'
import nodeName from '#ehtml/nodeName.js?v=4640752c'
import updateEFormIfNeeded from '#ehtml/updateEFormIfNeeded.js?v=083e9d9a'

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
