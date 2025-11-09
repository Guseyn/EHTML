import mapToTemplate from '#ehtml/actions/mapToTemplate.js?v=d34ba685'

export default (node) => {
  if (!node.hasAttribute('data-item-name')) {
    throw new Error('<template is="e-for-each"> must contain attribute "data-item-name"')
  }
  const wrapTemplate = document.createElement('template')
  const clonedNode = node.cloneNode(true)
  clonedNode.observedByEHTML = true
  wrapTemplate.content.appendChild(clonedNode)
  node.parentNode.replaceChild(wrapTemplate, node)
  mapToTemplate(wrapTemplate)
}
