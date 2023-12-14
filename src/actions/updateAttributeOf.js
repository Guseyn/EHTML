const elm = require('./../elm')

function updateAttributeOf (elmSelectorOrElm, attrName, attrValue) {
  elm(elmSelectorOrElm).setAttribute(attrName, attrValue)
}

window.updateAttributeOf = updateAttributeOf
module.exports = updateAttributeOf
