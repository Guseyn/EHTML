import setNodeScopedState from '#ehtml/setNodeScopedState.js'

export default function templateTriggerEventListener(template, state) {
  const contentNode = template.content.cloneNode(true)
  if (template.hasAttribute('data-prepend-to')) {
    const attr = template.getAttribute('data-prepend-to')
    const parentNode = document.querySelector(template.getAttribute('data-prepend-to'))
    if (!parentNode) {
      throw new Error(`element is not found by the selector ${attr} in data-prepend-to`)
    }
    setNodeScopedState(parentNode, state)
    parentNode.prepend(contentNode)
    return
  }

  if (template.hasAttribute('data-append-to')) {
    const attr = template.getAttribute('data-append-to')
    const parentNode = document.querySelector(template.getAttribute('data-append-to'))
    if (!parentNode) {
      throw new Error(`element is not found by the selector ${attr} in data-append-to`)
    }
    setNodeScopedState(parentNode, state)
    parentNode.append(contentNode)
    return
  }

  if (template.hasAttribute('data-insert-into')) {
    const attr = template.getAttribute('data-insert-into')
    const parentNode = document.querySelector(template.getAttribute('data-insert-into'))
    if (!parentNode) {
      throw new Error(`element is not found by the selector ${attr} in data-insert-into`)
    }
    setNodeScopedState(parentNode, state)
    parentNode.innerHTML = ''
    parentNode.append(contentNode)
    return
  }
  // default: insert BEFORE the template but do NOT remove it
  const parentNode = template.parentNode

  setNodeScopedState(parentNode, state)
  parentNode.insertBefore(contentNode, template)
}
