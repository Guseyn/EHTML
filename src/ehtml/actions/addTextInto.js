import elm from 'ehtml/elm'

export default function addTextInto (elmSelectorOrElm, txt) {
  elm(elmSelectorOrElm).textContent += txt
}

window.addTextInto = addTextInto
