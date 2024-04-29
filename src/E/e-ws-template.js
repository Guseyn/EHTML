const evaluateStringWithActionsOnProgress = require('./../evaluateStringWithActionsOnProgress')
const evaluateStringWithActionsOnOpenConnection = require('./../evaluateStringWithActionsOnOpenConnection')

module.exports = (node) => {
  const socketUrl = node.getAttribute('data-src')
  if (!socketUrl) {
    throw new Error('e-ws must have "data-src" attribute')
  }
  const socketName = node.getAttribute('data-socket-name')
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
    evaluateStringWithActionsOnOpenConnection(
      node.getAttribute('data-actions-on-open-connection'),
      node
    )
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
}
