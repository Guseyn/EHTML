const isTemplate = require('./../isTemplate')
const isTemplateWithType = require('./../isTemplateWithType')
const observeNodeAttributes = require('./../observeNodeAttributes')
const evaluatedStringWithParamsFromState = require('./../evaluatedStringWithParamsFromState')

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
  const elmContentNode = document.importNode(mappingElement.content, true)
  const objName = mappingElement.getAttribute('data-object-name')
  if (!objName) {
    throw new Error('Mapping element must have attribute "data-object-name"')
  }
  window.__ehtmlState__ = window.__ehtmlState__ || {}
  const state = window.__ehtmlState__
  // eslint-disable-next-line no-eval
  eval(`
    state['${objName}'] = obj
  `)
  map(elmContentNode, state)
  releaseTemplate(mappingElement, elmContentNode)
}

function releaseTemplate (mappingElement, elmContentNode) {
  if (isTemplateWithType(mappingElement, 'e-reusable')) {
    if (mappingElement.hasAttribute('data-prepend-to')) {
      const parentNode = document.querySelector(mappingElement.getAttribute('data-prepend-to'))
      if (!parentNode) {
        throw new Error('element is not found by the selector in the attribute "data-prepend-to"')
      }
      parentNode.prepend(elmContentNode)
    } else if (mappingElement.hasAttribute('data-append-to')) {
      const parentNode = document.querySelector(mappingElement.getAttribute('data-append-to'))
      if (!parentNode) {
        throw new Error('element is not found by the selector in the attribute "data-append-to"')
      }
      parentNode.append(elmContentNode)
    } else if (mappingElement.hasAttribute('data-insert-into')) {
      const parentNode = document.querySelector(mappingElement.getAttribute('data-insert-into'))
      if (!parentNode) {
        throw new Error('element is not found by the selector in the attribute "data-insert-into"')
      }
      parentNode.innerHTML = ''
      parentNode.append(elmContentNode)
    } else {
      mappingElement.parentNode.insertBefore(elmContentNode, mappingElement)
    }
  } else {
    mappingElement.parentNode.replaceChild(elmContentNode, mappingElement)
  }
}

function map (elmContentNode, state) {
  iterateChildNodes(
    elmContentNode, state, (node) => {
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
  const toDisplay = evaluatedStringWithParamsFromState(
    toDisplayExpression, state
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
  const listDefinitionExpressionBody = evaluatedStringWithParamsFromState(
    listDefinitionExpression,
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
    item.index = index + 1
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
