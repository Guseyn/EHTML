const elm = require('./../elm')

function addHTMLInto (elmSelectorOrElm, html) {
  elm(elmSelectorOrElm).innerHTML += html
}

window.addHTMLInto = addHTMLInto
module.exports = addHTMLInto
