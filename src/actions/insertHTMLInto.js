function insertHTMLInto (elmSelector, html) {
  const elm = document.querySelector(elmSelector)
  elm.innerHTML = html
}

window.insertHTMLInto = insertHTMLInto
module.exports = insertHTMLInto
