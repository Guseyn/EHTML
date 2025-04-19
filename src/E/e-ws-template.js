const evaluatedStringWithParamsFromState = require('./../evaluatedStringWithParamsFromState')
const evaluateStringWithActionsOnProgress = require('./../evaluateStringWithActionsOnProgress')
const evaluateStringWithActionsOnOpenConnection = require('./../evaluateStringWithActionsOnOpenConnection')
const evaluateStringWithActionsOnCloseConnection = require('./../evaluateStringWithActionsOnCloseConnection')

export default (node) => {
  if (!node.hasAttribute('data-src')) {
    throw new Error('e-ws must have "data-src" attribute')
  }
  const socketUrl = evaluatedStringWithParamsFromState(
    node.getAttribute('data-src'),
    node.__ehtmlState__,
    node
  )
  const socketName = evaluatedStringWithParamsFromState(
    node.getAttribute('data-socket-name'),
    node.__ehtmlState__,
    node
  )
  if (!socketName) {
    throw new Error('e-ws must have "data-socket-name" attribute')
  }
  const connectionIconSelector = node.getAttribute('data-connection-icon')
  const connectionIcon = document.querySelector(connectionIconSelector)
  if (connectionIcon) {
    connectionIcon.style.display = ''
  }
  const socket = new WebSocket(socketUrl)
  window.__ehtmlState__['webSockets'] = window.__ehtmlState__['webSockets'] || []
  window.__ehtmlState__['webSockets'][socketName] = socket
  if (node.hasAttribute('data-actions-on-progress-start')) {
    evaluateStringWithActionsOnProgress(
      node.getAttribute('data-actions-on-progress-start'),
      node
    )
  }
  socket.addEventListener('open', (event) => {
    if (connectionIcon) {
      connectionIcon.style.display = 'none'
    }
    if (node.hasAttribute('data-actions-on-open-connection')) {
      evaluateStringWithActionsOnOpenConnection(
        node.getAttribute('data-actions-on-open-connection'),
        event,
        node
      )
    }
    node.parentNode.replaceChild(
      node.content.cloneNode(true), node
    )
    if (node.hasAttribute('data-actions-on-progress-end')) {
      evaluateStringWithActionsOnProgress(
        node.getAttribute('data-actions-on-progress-end'),
        node
      )
    }
  })
  socket.addEventListener('close', (event) => {
    if (node.hasAttribute('data-actions-on-close-connection')) {
      evaluateStringWithActionsOnCloseConnection(
        node.getAttribute('data-actions-on-close-connection'),
        event,
        node
      )
    }
  })
}
