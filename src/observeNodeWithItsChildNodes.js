const E = require('./E/exports')
const nodeIsNotForEHTML = require('./nodeIsNotForEHTML')
const observeNodeAttributes = require('./observeNodeAttributes')
const nodeName = require('./nodeName')

const observeNodeWithItsChildNodes = (node) => {
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
    }
    const childNodes = node.childNodes
    for (let i = 0; i < childNodes.length; i++) {
      observeNodeWithItsChildNodes(childNodes[i])
    }
  }
}

module.exports = observeNodeWithItsChildNodes
