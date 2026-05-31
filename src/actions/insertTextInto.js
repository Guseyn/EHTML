import elm from '#ehtml/elm.js?v=41b9eaba'

export default function insertTextInto (elmSelector, txt) {
  elm(elmSelector).textContent = txt
}

window.insertTextInto = insertTextInto
