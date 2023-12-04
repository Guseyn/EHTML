const responseFromAjaxRequest = require('./../responseFromAjaxRequest')
const evaluatedStringWithParams = require('./../evaluatedStringWithParams')
const unwrappedChildrenOfParent = require('./../unwrappedChildrenOfParent')

module.exports = (node) => {
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
    if (window.location.hash.length > 1) {
      const hashElm = document.getElementById(window.location.hash.split('#')[1])
      if (hashElm) {
        hashElm.scrollIntoView()
      }
    }
  })
}
