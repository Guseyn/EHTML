import elm from '#ehtml/elm.js?v=21adcdae'

export default function insertHTMLInto (elmSelector, html) {
  elm(elmSelector).innerHTML = html
}

window.insertHTMLInto = insertHTMLInto
