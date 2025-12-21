import responseFromAjaxRequest from '#ehtml/responseFromAjaxRequest.js'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js'
import evaluateStringWithActionsOnProgress from '#ehtml/evaluateStringWithActionsOnProgress.js'
import mapToTemplate from '#ehtml/actions/mapToTemplate.js'
import scrollToHash from '#ehtml/actions/scrollToHash.js'

export default (node) => {
  const ajaxIconSelector = node.getAttribute('data-ajax-icon')
  const ajaxIcon = document.querySelector(ajaxIconSelector)
  if (ajaxIcon) {
    ajaxIcon.style.display = ''
  }
  const progressBarSelector = node.getAttribute('data-progress-bar')
  const progressBar = document.querySelector(progressBarSelector)
  if (progressBar) {
    progressBar.max = 100
    progressBar.value = 0
    progressBar.style.display = 'none'
  }
  const socketName = node.getAttribute('data-socket')
  if (socketName) {
    if (!window.__ehtmlState__['webSockets'] || !window.__ehtmlState__['webSockets'][socketName]) {
      throw new Error(`socket with name "${socketName}" is not defined or not opened yet`)
    }
    const socket = window.__ehtmlState__['webSockets'][socketName]
    socket.addEventListener('message', (event) => {
      const response = JSON.parse(event.data)
      mapToTemplate(
        node,
        response
      )
    })
    return
  }
  if (node.hasAttribute('data-actions-on-progress-start')) {
    evaluateStringWithActionsOnProgress(
      node.getAttribute('data-actions-on-progress-start'),
      node
    )
  }
  if (!node.hasAttribute('data-src')) {
    throw new Error('e-json template must have "data-src" attribute if it\'s not connected to a socket')
  }
  responseFromAjaxRequest({
    url: encodeURI(
      evaluatedStringWithParamsFromState(
        node.getAttribute('data-src'),
        node.__ehtmlState__,
        node
      )
    ),
    method: 'GET',
    headers: JSON.parse(
      evaluatedStringWithParamsFromState(
        node.getAttribute('data-request-headers'),
        node.__ehtmlState__,
        node
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
    mapToTemplate(
      node,
      {
        body: responseBodyAsObject,
        headers: resObj.headers,
        statusCode: resObj.statusCode
      }
    )
    if (node.hasAttribute('data-actions-on-progress-end')) {
      evaluateStringWithActionsOnProgress(
        node.getAttribute('data-actions-on-progress-end'),
        node
      )
    }
    scrollToHash()
  })
}
