import elm from '#ehtml/elm.js?v=21adcdae'

export default function updateAttributeOf (elmSelectorOrElm, attrName, attrValue) {
  elm(elmSelectorOrElm).setAttribute(attrName, attrValue)
}

window.updateAttributeOf = updateAttributeOf
