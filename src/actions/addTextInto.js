const elm = require('./../elm')

export default function addTextInto (elmSelectorOrElm, txt) {
  elm(elmSelectorOrElm).textContent += txt
}

window.addTextInto = addTextInto
module.exports = addTextInto
