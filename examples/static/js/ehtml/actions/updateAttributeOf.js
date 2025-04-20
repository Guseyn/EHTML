import elms from 'ehtml/elms'

export default function updateAttributeOf (elmSelectorOrElm, attrName, attrValue) {
  elm(elmSelectorOrElm).setAttribute(attrName, attrValue)
}

window.updateAttributeOf = updateAttributeOf
