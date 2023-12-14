const elm = require('./../elm')
const responseFromAjaxRequest = require('./../responseFromAjaxRequest')

function loadTextInto (elmSelectorOrElm, url, headers) {
  responseFromAjaxRequest({
    url: encodeURI(url),
    method: 'GET',
    headers: headers || {}
  }, null, (err, resObj) => {
    if (err) {
      throw err
    }
    const txt = resObj.body
    elm(elmSelectorOrElm).textContent = txt
  })
}

window.loadTextInto = loadTextInto
module.exports = loadTextInto
