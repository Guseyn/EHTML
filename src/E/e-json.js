const responseFromAjaxRequest = require('./../responseFromAjaxRequest')
const evaluatedStringWithParams = require('./../evaluatedStringWithParams')
const evaluateStringWithActionsOnResponse = require('./../evaluateStringWithActionsOnResponse')
const unwrappedChildrenOfParent = require('./../unwrappedChildrenOfParent')
const scrollToHash = require('./../scrollToHash')

module.exports = (node) => {
  const ajaxIconSelector = node.getAttribute('data-ajax-icon')
  const ajaxIcon = document.querySelector(ajaxIconSelector)
  if (ajaxIcon) {
    ajaxIcon.style.display = ''
  }
  const socketName = node.getAttribute('data-socket')
  if (socketName) {
    if (!window.__ehtmlState__['webSockets'] || !window.__ehtmlState__['webSockets'][socketName]) {
      throw new Error(`socket with name "${socketName}" is not defined or not opened yet`)
    }
    const socket = window.__ehtmlState__['webSockets'][socketName]
    socket.addEventListener('message', (event) => {
      const response = JSON.parse(event.data)
      evaluateStringWithActionsOnResponse(
        node.getAttribute('data-actions-on-response'),
        node.getAttribute('data-response-name'),
        response
      )
    })
    unwrappedChildrenOfParent(node)
    return
  }
  const progressBarSelector = node.getAttribute('data-progress-bar')
  const progressBar = document.querySelector(progressBarSelector)
  if (progressBar) {
    progressBar.max = 100
    progressBar.value = 0
    progressBar.style.display = 'none'
  }
  responseFromAjaxRequest({
    url: encodeURI(node.getAttribute('data-src')),
    method: 'GET',
    headers: JSON.parse(
      evaluatedStringWithParams(
        node.getAttribute('data-request-headers')
      ) || '{}'
    ),
    progressEvent: (event) => {
      if (progressBar) {
        if (event.lengthComputable) {
          progressBar.style.display = ''
          const percentComplete = parseInt((event.loaded / event.total) * 100)
          progressBar.value = percentComplete
          if (progressBar.value === 100) {
            progressBar.style.display = 'none'
          }
        }
      }
    }
  }, undefined, (err, resObj) => {
    if (err) {
      throw err
    }
    if (ajaxIcon) {
      ajaxIcon.style.display = 'none'
    }
    const responseBodyAsBuffer = resObj.body
    const responseBodyAsObject = JSON.parse(
      responseBodyAsBuffer.toString('utf-8', 0, responseBodyAsBuffer.length)
    )
    evaluateStringWithActionsOnResponse(
      node.getAttribute('data-actions-on-response'),
      node.getAttribute('data-response-name'),
      {
        body: responseBodyAsObject,
        statusCode: resObj.statusCode,
        headers: resObj.headers
      }
    )
    unwrappedChildrenOfParent(node)
    scrollToHash()
  })
}
