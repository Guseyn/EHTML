import elm from '#ehtml/elm.js'

export default function insertHTMLInto (elmSelector, html) {
  elm(elmSelector).innerHTML = html
}

window.insertHTMLInto = insertHTMLInto
