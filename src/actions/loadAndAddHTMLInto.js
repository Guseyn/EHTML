import elm from '#ehtml/elm.js'
import ajax from '#ehtml/ajax.js'

export default function loadAndAddHTMLInto (elmSelectorOrElm, url, headers) {
  ajax({
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
