import elm from '#ehtml/elm.js'
import ajax from '#ehtml/ajax.js'

export default function loadTextInto (elmSelectorOrElm, url, headers) {
  ajax({
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
