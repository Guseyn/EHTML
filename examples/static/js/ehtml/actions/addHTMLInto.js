import elm from '#ehtml/elm.js?v=21adcdae'

export default function addHTMLInto (elmSelectorOrElm, html) {
  elm(elmSelectorOrElm).innerHTML += html
}

window.addHTMLInto = addHTMLInto
