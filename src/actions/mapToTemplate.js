import elm from '#ehtml/elm.js?v=21adcdae'
import isTemplate from '#ehtml/isTemplate.js?v=e3182ac2'
import isTemplateWithType from '#ehtml/isTemplateWithType.js?v=32c9a935'
import observeNodeAttributes from '#ehtml/observeNodeAttributes.js?v=b46e4e7c'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js?v=e2d7e253'
import releaseTemplateWithItsContent from '#ehtml/releaseTemplateWithItsContent.js?v=17aa3204'

export default function mapToTemplate (elmSelectorOrElm, obj) {
  const mappingElement = elm(elmSelectorOrElm)
  if (mappingElement === null || mappingElement === undefined) {
    console.log(elmSelectorOrElm, mappingElement, obj)
    throw new Error('Mapping element is not found')
  }
  if (!isTemplate(mappingElement)) {
    console.log(elmSelectorOrElm, mappingElement, obj)
    throw new Error('Mapping element must be <template>')
  }
  if (isTemplateWithType(mappingElement, 'e-if')) {
    throw new Error('You cannot call mapToTemplate() on <template is="e-if"> directly, please wrap it with <template> with attribute "data-object-name".  We think it\'s important to declare such attribute in a separate template for consistency.')
  }
  if (isTemplateWithType(mappingElement, 'e-for-each')) {
    throw new Error('You cannot call mapToTemplate() on <template is="e-for-each"> directly, please wrap it with <template> with attribute "data-object-name".  We think it\'s important to declare such attribute in a separate template for consistency.')
  }
  const elmContentNode = mappingElement.content.cloneNode(true)
  const objName = mappingElement.getAttribute('data-object-name')
  if (!objName && obj) {
    throw new Error('Mapping element must have attribute "data-object-name"')
  }
  mappingElement.__ehtmlState__ = mappingElement.__ehtmlState__ || {}
  const state = mappingElement.__ehtmlState__
  if (obj) {
    state[objName] = obj
  }
  map(elmContentNode, state)
  releaseTemplateWithItsContent(mappingElement, elmContentNode)
}

function map (elmContentNode, state) {
  iterateChildNodes(
    elmContentNode, (node) => {
      const overridenState = { ...state }
      if (isTemplate(node)) {
        node.__ehtmlState__ = overridenState
      }
      if (isTemplateWithType(node, 'e-for-each')) {
        activateEForEach(node, overridenState)
        node.observedByEHTML = true
        node.activatedByHTML = true
      } else if (isTemplateWithType(node, 'e-if')) {
        activateEIf(node, overridenState)
        node.observedByEHTML = true
        node.activatedByHTML = true
      } else {
        observeNodeAttributes(node, overridenState)
        node.attributesObservedByEHTML = true
      }
    }
  )
}

function iterateChildNodes (elm, func) {
  // Just a reminder: templates don't have child nodes,
  // thefore it's save to iterate recursively
  const childNodes = Array.from(elm.childNodes)
  childNodes.forEach(node => {
    func(node)
    if (node.childNodes.length !== 0) {
      iterateChildNodes(node, func)
    }
  })
}

function activateEIf (node, state) {
  const toDisplayExpression = node.getAttribute('data-condition-to-display')
  if (!toDisplayExpression) {
    throw new Error('e-if must have "data-condition-to-display" attribute')
  }
  const inlinedToDisplayExpression = toDisplayExpression.replace(/\n/g, ' ')
  const toDisplay = evaluatedStringWithParamsFromState(
    inlinedToDisplayExpression, state, node
  ).trim()
  if (toDisplay === 'true') {
    const contentNode = node.content.cloneNode(true)
    map(contentNode, state)
    node.parentNode.insertBefore(contentNode, node)
  }
  node.parentNode.removeChild(node)
}

function activateEForEach (node, state) {
  const listDefinitionExpression = node.getAttribute('data-list-to-iterate')
  const itemName = node.getAttribute('data-item-name')
  if (!listDefinitionExpression) {
    throw new Error('e-for-each must have "data-list-to-iterate" attribute')
  }
  if (!itemName) {
    throw new Error('e-for-each must have "data-item-name" attribute')
  }
  const inlinedListDefinitionExpression = listDefinitionExpression.replace(/\n/g, ' ')
  const listDefinitionExpressionBody = evaluatedStringWithParamsFromState(
    inlinedListDefinitionExpression,
    state
  )
  let list
  try {
    list = JSON.parse(listDefinitionExpressionBody)
  } catch (e) {
    throw new Error('value in attribute "data-list-to-iterate" is not iterable (array)')
  }
  const listFragment = document.createDocumentFragment()
  list.forEach((item, index) => {
    if (typeof item === 'object' && item['index'] === undefined) {
      item.index = index + 1
    }
    const itemContentNode = node.content.cloneNode(true)
    const overridenState = { ...state, [itemName]: item }
    map(itemContentNode, overridenState)
    listFragment.appendChild(itemContentNode)
  })
  node.parentNode.replaceChild(listFragment, node)
}

window.mapToTemplate = mapToTemplate
