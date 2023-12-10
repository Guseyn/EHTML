const unwrappedChildrenOfParent = require('./../unwrappedChildrenOfParent')
const responseFromAjaxRequest = require('./../responseFromAjaxRequest')
const evaluatedStringWithParams = require('./../evaluatedStringWithParams')
const scrollToHash = require('./../scrollToHash')

module.exports = (node) => {
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
    scrollToHash()
  })
}
