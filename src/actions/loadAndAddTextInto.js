const elm = require('./../elm')
const responseFromAjaxRequest = require('./../responseFromAjaxRequest')

function loadAndAddTxtInto (elmSelectorOrElm, url, headers) {
  responseFromAjaxRequest({
    url: encodeURI(url),
    method: 'GET',
    headers: headers || {}
  }, null, (err, resObj) => {
    if (err) {
      throw err
    }
    const txt = resObj.body
    elm(elmSelectorOrElm).textContent += txt
  })
}

window.loadAndAddHTMLInto = loadAndAddTxtInto
module.exports = loadAndAddTxtInto
