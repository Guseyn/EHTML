import elm from '#ehtml/elm.js'
import responseFromAjaxRequest from '#ehtml/responseFromAjaxRequest.js'

export default function loadAndAddHTMLInto (elmSelectorOrElm, url, headers) {
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
