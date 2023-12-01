const responseFromAjaxRequest = require('./../responseFromAjaxRequest')
const evaluatedStringWithParams = require('./../evaluatedStringWithParams')

function loadHTMLInto (elmSelector, url, headers) {
  const elm = document.querySelector(elmSelector)
  responseFromAjaxRequest({
    url: encodeURI(elm.getAttribute('data-src')),
    method: 'GET',
    headers: JSON.parse(
      evaluatedStringWithParams(
        elm.getAttribute('data-request-headers')
      ) || '{}'
    )
  }, (err, resObj) => {
    if (err) {
      throw err
    }
    const html = resObj.body
    elm.innerHTML = html
  })
}

window.loadHTMLInto = loadHTMLInto
module.exports = loadHTMLInto
