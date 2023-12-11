const evaluatedStringWithParams = require('./../evaluatedStringWithParams')

module.exports = (node) => {
  const listDefinitionExpression = node.getAttribute('data-list-to-iterate')
  const itemName = node.getAttribute('data-item-name')
  if (!listDefinitionExpression) {
    throw new Error('e-for-each must have "data-list-to-iterate" attribute')
  }
  if (!itemName) {
    throw new Error('e-for-each must have "data-item-name" attribute')
  }
  const listDefinitionExpressionBody = evaluatedStringWithParams(
    listDefinitionExpression
  )
  let list
  try {
    list = JSON.parse(listDefinitionExpressionBody)
  } catch (e) {
    throw new Error('value in attribute "data-list-to-iterate" is not iterable (array)')
  }
  const listFragment = document.createDocumentFragment()
  list.forEach((item, index) => {
    item.index = index + 1
    const itemContentNode = document.importNode(node.content, true)
    listFragment.appendChild(itemContentNode)
  })
  node.parentNode.replaceChild(listFragment, node)
}
