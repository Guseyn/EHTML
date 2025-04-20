import elm from 'ehtml/elm'
import responseFromAjaxRequest from 'ehtml/responseFromAjaxRequest'

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
