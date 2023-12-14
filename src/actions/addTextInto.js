const elm = require('./../elm')

function addTextInto (elmSelectorOrElm, txt) {
  elm(elmSelectorOrElm).textContent += txt
}

window.addTextInto = addTextInto
module.exports = addTextInto
