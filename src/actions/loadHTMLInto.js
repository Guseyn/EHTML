import elm from '#ehtml/elm.js'
import ajax from '#ehtml/ajax.js'

export default function loadHTMLInto (elmSelectorOrElm, url, headers) {
  ajax({
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
