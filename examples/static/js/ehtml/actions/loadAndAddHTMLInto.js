import elm from 'ehtml/elm'
import responseFromAjaxRequest from 'ehtml/responseFromAjaxRequest'

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
