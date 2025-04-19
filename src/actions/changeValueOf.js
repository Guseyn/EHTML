const elm = require('./../elm')

export default function changeValueOf (elmSelectorOrElm, value) {
  elm(elmSelectorOrElm).value = value
}

window.changeValueOf = changeValueOf
module.exports = changeValueOf
