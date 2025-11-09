import elm from '#ehtml/elm.js?v=21adcdae'

export default function addTextInto (elmSelectorOrElm, txt) {
  elm(elmSelectorOrElm).textContent += txt
}

window.addTextInto = addTextInto
