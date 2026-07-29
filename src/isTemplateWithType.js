import isTemplate from '#ehtml/isTemplate.js?v=e3182ac2'

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
