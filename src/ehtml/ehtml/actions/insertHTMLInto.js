import elm from 'ehtml/elm'

export default function insertHTMLInto (elmSelector, html) {
  elm(elmSelector).innerHTML = html
}

window.insertHTMLInto = insertHTMLInto
