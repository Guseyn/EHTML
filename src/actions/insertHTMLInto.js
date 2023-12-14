const elm = require('./../elm')

function insertHTMLInto (elmSelector, html) {
  elm(elmSelector).innerHTML = html
}

window.insertHTMLInto = insertHTMLInto
module.exports = insertHTMLInto
