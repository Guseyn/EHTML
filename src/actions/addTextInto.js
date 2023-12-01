function addTextInto (elmSelector, txt) {
  const elm = document.querySelector(elmSelector)
  elm.textContent += txt
}

window.addTextInto = addTextInto
module.exports = addTextInto
