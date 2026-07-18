import elm from '#ehtml/elm.js'
import ajax from '#ehtml/ajax.js'

export default function loadAndAddTxtInto (elmSelectorOrElm, url, headers) {
  ajax({
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

window.loadAndAddTxtInto = loadAndAddTxtInto
