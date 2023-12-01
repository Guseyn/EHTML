function insertTextInto (elmSelector, txt) {
  const elm = document.querySelector(elmSelector)
  elm.textContent = txt
}

window.insertTextInto = insertTextInto
module.exports = insertTextInto
