import elm from '#ehtml/elm.js'

export default function insertTextInto (elmSelector, txt) {
  elm(elmSelector).textContent = txt
}

window.insertTextInto = insertTextInto
