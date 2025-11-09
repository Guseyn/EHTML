import elm from '#ehtml/elm.js?v=21adcdae'

export default function insertTextInto (elmSelector, txt) {
  elm(elmSelector).textContent = txt
}

window.insertTextInto = insertTextInto
