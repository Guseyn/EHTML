const isTemplate = require('./../isTemplate')
const isTemplateWithType = require('./../isTemplateWithType')
const observeNodeAttributes = require('./../observeNodeAttributes')
const evaluatedStringWithParamsFromState = require('./../evaluatedStringWithParamsFromState')
const releaseTemplateWithItsContent = require('./../releaseTemplateWithItsContent')

function mapToTemplate (elmSelectorOrElm, obj) {
  const mappingElement = typeof elmSelectorOrElm === 'string'
    ? document.querySelector(elmSelectorOrElm)
    : elmSelectorOrElm
  if (mappingElement === null || mappingElement === undefined) {
    throw new Error('Mapping element is not found')
  }
  if (!isTemplate(mappingElement)) {
    throw new Error('Mapping element must be <template>')
  }
  if (isTemplateWithType(mappingElement, 'e-if')) {
    throw new Error('You cannot call mapToTemplate() on <template is="e-if"> directly, please wrap it with <template> with attribute "data-object-name".  We think it\'s important to declare such attribute in a separate template for consistency.')
  }
  if (isTemplateWithType(mappingElement, 'e-for-each')) {
    throw new Error('You cannot call mapToTemplate() on <template is="e-for-each"> directly, please wrap it with <template> with attribute "data-object-name".  We think it\'s important to declare such attribute in a separate template for consistency.')
  }
  const elmContentNode = document.importNode(mappingElement.content, true)
  const objName = mappingElement.getAttribute('data-object-name')
  if (!objName && obj) {
    throw new Error('Mapping element must have attribute "data-object-name"')
  }
  mappingElement.__ehtmlState__ = mappingElement.__ehtmlState__ || {
    __objNamesStackInEhtmlState__: []
  }
  const state = mappingElement.__ehtmlState__
  const objNameIndex = state.__objNamesStackInEhtmlState__.indexOf(objName)
  // For the sake of clarity, let's clear state
  if (objNameIndex !== -1) {
    for (let objNameIndexToClear = objNameIndex; objNameIndexToClear < state.__objNamesStackInEhtmlState__.length; objNameIndexToClear++) {
      delete mappingElement.__ehtmlState__[state.__objNamesStackInEhtmlState__[objNameIndexToClear]]
    }
    state.__objNamesStackInEhtmlState__.splice(objNameIndex)
  }
  if (obj) {
    // eslint-disable-next-line no-eval
    eval(`
      state['${objName}'] = obj
    `)
    state.__objNamesStackInEhtmlState__.push(objName)
  }
  map(elmContentNode, state)
  releaseTemplateWithItsContent(mappingElement, elmContentNode)
}

function map (elmContentNode, state) {
  elmContentNode.__ehtmlState__ = state
  iterateChildNodes(
    elmContentNode, state, (node) => {
      node.__ehtmlState__ = state
      if (isTemplateWithType(node, 'e-for-each')) {
        activateEForEach(node, state)
        node.observedByEHTML = true
        node.activatedByHTML = true
      } else if (isTemplateWithType(node, 'e-if')) {
        activateEIf(node, state)
        node.observedByEHTML = true
        node.activatedByHTML = true
      } else {
        observeNodeAttributes(node, state)
        node.attributesObservedByEHTML = true
      }
    }
  )
}

function iterateChildNodes (elm, state, func) {
  // Just a reminder: templates don't have child nodes,
  // thefore it's save to iterate recursively
  const childNodes = Array.from(elm.childNodes)
  childNodes.forEach(node => {
    func(node)
    if (node.childNodes.length !== 0) {
      iterateChildNodes(node, state, func)
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
    inlinedToDisplayExpression, state
  ).trim()
  if (toDisplay === 'true') {
    const contentNode = document.importNode(node.content, true)
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
    const itemContentNode = document.importNode(node.content, true)
    state[itemName] = item
    map(itemContentNode, state)
    delete state[itemName]
    listFragment.appendChild(itemContentNode)
  })
  node.parentNode.replaceChild(listFragment, node)
}

window.mapToTemplate = mapToTemplate
module.exports = mapToTemplate
