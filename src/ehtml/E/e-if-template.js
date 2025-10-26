import evaluatedStringWithParams from 'ehtml/evaluatedStringWithParams'

export default (node) => {
  const toDisplayExpression = node.getAttribute('data-condition-to-display')
  if (!toDisplayExpression) {
    throw new Error('e-if must have "data-condition-to-display" attribute')
  }
  const toDisplay = evaluatedStringWithParams(toDisplayExpression)
  if (toDisplay === 'true') {
    const contentNode = node.content.cloneNode(true)
    node.parentNode.insertBefore(contentNode, node)
  }
  node.parentNode.removeChild(node)
}
