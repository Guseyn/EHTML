const mapToTemaplte = require('./../actions/mapToTemplate')

module.exports = (node) => {
  if (!node.hasAttribute('data-item-name')) {
    throw new Error('<template is="e-for-each"> must contain attribute "data-item-name"')
  }
  const wrapTemplate = document.createElement('template')
  wrapTemplate.setAttribute('data-object-name', `listOf${node.getAttribute('data-item-name')}s`)
  const clonedNode = node.cloneNode(true)
  clonedNode.observedByEHTML = true
  wrapTemplate.content.appendChild(clonedNode)
  node.parentNode.replaceChild(wrapTemplate, node)
  mapToTemaplte(wrapTemplate, {})
}
