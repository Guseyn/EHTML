import setNodeScopedState from '#ehtml/setNodeScopedState.js'
import evaluatedValueWithParamsFromState from '#ehtml/evaluatedValueWithParamsFromState.js'

export default function templateTriggerEventListener(template, state) {
  const contentNode = document.importNode(template.content, true)
  if (template.hasAttribute('data-prepend-to')) {
    const attr = template.getAttribute('data-prepend-to')
    const hasParams = attr.startsWith('${')
    let parentNode
    if (hasParams) {
      parentNode = evaluatedValueWithParamsFromState(attr, state, template)
    } else {
      parentNode = document.querySelector(attr)
    }
    if (!parentNode) {
      throw new Error(`element is not found by the selector ${attr} in data-prepend-to`)
    }
    setNodeScopedState(parentNode, state)
    parentNode.prepend(contentNode)
    return
  }

  if (template.hasAttribute('data-append-to')) {
    const attr = template.getAttribute('data-append-to')
    const hasParams = attr.startsWith('${')
    let parentNode
    if (hasParams) {
      parentNode = evaluatedValueWithParamsFromState(attr, state, template)
    } else {
      parentNode = document.querySelector(attr)
    }
    if (!parentNode) {
      throw new Error(`element is not found by the selector ${attr} in data-append-to`)
    }
    setNodeScopedState(parentNode, state)
    parentNode.append(contentNode)
    return
  }

  if (template.hasAttribute('data-insert-into')) {
    const attr = template.getAttribute('data-insert-into')
    const hasParams = attr.startsWith('${')
    let parentNode
    if (hasParams) {
      parentNode = evaluatedValueWithParamsFromState(attr, state, template)
    } else {
      parentNode = document.querySelector(attr)
    }
    if (!parentNode) {
      throw new Error(`element is not found by the selector ${attr} in data-insert-into`)
    }
    setNodeScopedState(parentNode, state)
    parentNode.innerHTML = ''
    parentNode.append(contentNode)
    return
  }

  if (template.hasAttribute('data-place-instead')) {
    const attr = template.getAttribute('data-place-instead')
    const hasParams = attr.startsWith('${')
    let targetNode
    if (hasParams) {
      targetNode = evaluatedValueWithParamsFromState(attr, state, template)
    } else {
      targetNode = document.querySelector(attr)
    }
    const parentNode = targetNode.parentNode
    if (!targetNode) {
      throw new Error(`element is not found by the selector ${attr} in data-place-instead`)
    }
    setNodeScopedState(parentNode, state)
    parentNode.replaceChild(contentNode, targetNode)
    return
  }
  // default: insert BEFORE the template but do NOT remove it
  const parentNode = template.parentNode

  setNodeScopedState(parentNode, state)
  parentNode.insertBefore(contentNode, template)
}
