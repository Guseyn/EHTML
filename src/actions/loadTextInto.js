const responseFromAjaxRequest = require('./../responseFromAjaxRequest')
const evaluatedStringWithParams = require('./../evaluatedStringWithParams')

function loadTextInto (elmSelector, url, headers) {
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
    const txt = resObj.body
    elm.textContent = txt
  })
}

window.loadTextInto = loadTextInto
module.exports = loadTextInto
