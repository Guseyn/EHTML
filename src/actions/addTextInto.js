import elm from '#ehtml/elm.js'

export default function addTextInto (elmSelectorOrElm, txt) {
  elm(elmSelectorOrElm).textContent += txt
}

window.addTextInto = addTextInto
