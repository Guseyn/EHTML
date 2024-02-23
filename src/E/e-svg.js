const unwrappedChildrenOfParent = require('./../unwrappedChildrenOfParent')
const responseFromAjaxRequest = require('./../responseFromAjaxRequest')
const evaluatedStringWithParams = require('./../evaluatedStringWithParams')
const evaluateStringWithActionsOnProgress = require('./../evaluateStringWithActionsOnProgress')
const scrollToHash = require('./../actions/scrollToHash')

module.exports = (node) => {
  if (node.hasAttribute('data-actions-on-progress-start')) {
    evaluateStringWithActionsOnProgress(
      node.getAttribute('data-actions-on-progress-start'),
      node
    )
  }
  responseFromAjaxRequest({
    url: encodeURI(node.getAttribute('data-src')),
    method: 'GET',
    headers: JSON.parse(
      evaluatedStringWithParams(
        node.getAttribute('data-headers') || '{}'
      )
    )
  }, undefined, (err, resObj) => {
    if (err) {
      throw err
    }
    const svg = resObj.body
    node.innerHTML = svg
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
