import elm from 'ehtml/elm'

export default function updateAttributeOf (elmSelectorOrElm, attrName, attrValue) {
  elm(elmSelectorOrElm).setAttribute(attrName, attrValue)
}

window.updateAttributeOf = updateAttributeOf
