import responseFromAjaxRequest from '#ehtml/responseFromAjaxRequest.js?v=4d85ec20'
import evaluatedStringWithParamsFromState from '#ehtml/evaluatedStringWithParamsFromState.js?v=e2d7e253'
import evaluateStringWithActionsOnProgress from '#ehtml/evaluateStringWithActionsOnProgress.js?v=c20d640c'
import evaluateStringWithActionsOnResponse from '#ehtml/evaluateStringWithActionsOnResponse.js?v=2edf1120'
import unwrappedChildrenOfParent from '#ehtml/unwrappedChildrenOfParent.js?v=dced24cf'
import scrollToHash from '#ehtml/actions/scrollToHash.js?v=e7d61ab5'

export default (node) => {
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
        response,
        node
      )
    })
    unwrappedChildrenOfParent(node)
    return
  }
  const cacheFromAttribute = node.getAttribute('data-cache-from')
  if (cacheFromAttribute) {
    const evaluatedCacheAsString = evaluatedStringWithParamsFromState(
      cacheFromAttribute,
      node.__ehtmlState__,
      node
    )
    if (evaluatedCacheAsString !== 'undefined' && evaluatedCacheAsString !== 'null') {
      const cacheObj = JSON.parse(evaluatedCacheAsString)
      if (cacheObj) {
        evaluateStringWithActionsOnResponse(
          node.getAttribute('data-actions-on-response'),
          node.getAttribute('data-response-name'),
          cacheObj,
          node
        )
        unwrappedChildrenOfParent(node)
        scrollToHash()
        return
      }
    }
  }
  const progressBarSelector = node.getAttribute('data-progress-bar')
  const progressBar = document.querySelector(progressBarSelector)
  if (progressBar) {
    progressBar.max = 100
    progressBar.value = 0
    progressBar.style.display = 'none'
  }
  if (node.hasAttribute('data-actions-on-progress-start')) {
    evaluateStringWithActionsOnProgress(
      node.getAttribute('data-actions-on-progress-start'),
      node
    )
  }
  if (!node.hasAttribute('data-src')) {
    throw new Error('e-json must have "data-src" attribute if it\'s not connected to a socket')
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
        node.getAttribute('data-request-headers') || '{}',
        node.__ehtmlState__,
        node
      )
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
      },
      node
    )
    unwrappedChildrenOfParent(node)
    if (node.hasAttribute('data-actions-on-progress-end')) {
      evaluateStringWithActionsOnProgress(
        node.getAttribute('data-actions-on-progress-end'),
        node
      )
    }
    scrollToHash()
  })
}
