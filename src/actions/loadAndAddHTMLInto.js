const elm = require('./../elm')
const responseFromAjaxRequest = require('./../responseFromAjaxRequest')

function loadAndAddHTMLInto (elmSelectorOrElm, url, headers) {
  responseFromAjaxRequest({
    url: encodeURI(url),
    method: 'GET',
    headers: headers || {}
  }, null, (err, resObj) => {
    if (err) {
      throw err
    }
    const html = resObj.body
    elm(elmSelectorOrElm).innerHTML += html
  })
}

window.loadAndAddHTMLInto = loadAndAddHTMLInto
module.exports = loadAndAddHTMLInto
