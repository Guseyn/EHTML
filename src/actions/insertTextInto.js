const elm = require('./../elm')

function insertTextInto (elmSelector, txt) {
  elm(elmSelector).textContent = txt
}

window.insertTextInto = insertTextInto
module.exports = insertTextInto
