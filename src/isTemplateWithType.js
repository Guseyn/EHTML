import isTemplate from '#ehtml/isTemplate.js'

export default function (node, type) {
  if (isTemplate(node)) {
    const templateType = node.getAttribute('is')
    if (templateType) {
      return templateType === type
    }
    return false
  }
  return false
}
