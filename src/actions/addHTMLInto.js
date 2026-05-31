import elm from '#ehtml/elm.js'

export default function addHTMLInto (elmSelectorOrElm, html) {
  elm(elmSelectorOrElm).innerHTML += html
}

window.addHTMLInto = addHTMLInto
