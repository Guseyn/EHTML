const unwrappedChildrenOfParent = require('./../unwrappedChildrenOfParent')
const responseFromAjaxRequest = require('./../responseFromAjaxRequest')
const evaluatedStringWithParamsFromState = require('./../evaluatedStringWithParamsFromState')
const evaluateStringWithActionsOnProgress = require('./../evaluateStringWithActionsOnProgress')
const prettyHtml = require('json-pretty-html').default
const scrollToHash = require('./../actions/scrollToHash')

export default (node) => {
  if (node.hasAttribute('data-actions-on-progress-start')) {
    evaluateStringWithActionsOnProgress(
      node.getAttribute('data-actions-on-progress-start'),
      node
    )
  }
  if (!node.hasAttribute('data-src')) {
    throw new Error('e-json-view must have "data-src" attribute')
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
        node.getAttribute('data-headers') || '{}',
        node.__ehtmlState__,
        node
      )
    )
  }, undefined, (err, resObj) => {
    if (err) {
      throw err
    }
    const responseBodyAsBuffer = resObj.body
    const responseBodyAsObject = JSON.parse(
      responseBodyAsBuffer.toString('utf-8', 0, responseBodyAsBuffer.length)
    )
    node.innerHTML = prettyHtml(
      responseBodyAsObject
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
