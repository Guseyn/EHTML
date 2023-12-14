const elm = require('./../elm')

function changeValueOf (elmSelectorOrElm, value) {
  elm(elmSelectorOrElm).value = value
}

window.changeValueOf = changeValueOf
module.exports = changeValueOf
