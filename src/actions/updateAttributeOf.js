function updateAttributeOf (elmSelector, attrName, attrValue) {
  const elm = document.querySelector(elmSelector)
  elm.setAttribute(attrName, attrValue)
}

window.updateAttributeOf = updateAttributeOf
module.exports = updateAttributeOf
