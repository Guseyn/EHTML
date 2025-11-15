import elm from '#ehtml/elm.js?v=21adcdae'
import responseFromAjaxRequest from '#ehtml/responseFromAjaxRequest.js?v=4d85ec20'

export default function loadHTMLInto (elmSelectorOrElm, url, headers) {
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
