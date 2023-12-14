const elm = require('./../elm')
const responseFromAjaxRequest = require('./../responseFromAjaxRequest')

function loadHTMLInto (elmSelectorOrElm, url, headers) {
  responseFromAjaxRequest({
    url: encodeURI(url),
    method: 'GET',
    headers: headers || {}
  }, null, (err, resObj) => {
    if (err) {
      throw err
    }
    const html = resObj.body
    elm(elmSelectorOrElm).innerHTML = html
  })
}

window.loadHTMLInto = loadHTMLInto
module.exports = loadHTMLInto
