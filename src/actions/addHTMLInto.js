function addHTMLInto (elmSelector, html) {
  const elm = document.querySelector(elmSelector)
  elm.innerHTML += html
}

window.addHTMLInto = addHTMLInto
module.exports = addHTMLInto
