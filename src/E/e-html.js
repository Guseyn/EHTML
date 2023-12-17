const responseFromAjaxRequest = require('./../responseFromAjaxRequest')
const evaluatedStringWithParams = require('./../evaluatedStringWithParams')
const evaluateStringWithActionsOnProgress = require('./../evaluateStringWithActionsOnProgress')
const unwrappedChildrenOfParent = require('./../unwrappedChildrenOfParent')
const scrollToHash = require('./../scrollToHash')

module.exports = (node) => {
  if (node.hasAttribute('data-actions-on-progress')) {
    evaluateStringWithActionsOnProgress(
      node.getAttribute('data-actions-on-progress'),
      node
    )
  }
  responseFromAjaxRequest({
    url: encodeURI(node.getAttribute('data-src')),
    method: 'GET',
    headers: JSON.parse(
      evaluatedStringWithParams(
        node.getAttribute('data-request-headers')
      ) || '{}'
    )
  }, undefined, (err, resObj) => {
    if (err) {
      throw err
    }
    const responseBody = resObj.body
    node.innerHTML = responseBody
    unwrappedChildrenOfParent(node)
    scrollToHash()
  })
}
