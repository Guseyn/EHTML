import isTemplateWithTypeExclusively from '#ehtml/isTemplateWithTypeExclusively.js?v=46e3bf34'
import isTemplateWithType from '#ehtml/isTemplateWithType.js?v=32c9a935'
import isTemplate from '#ehtml/isTemplate.js?v=e3182ac2'

export default function (node) {
  if (isTemplateWithType(node, 'e-json')) {
    return 'e-json-template'
  }
  if (isTemplateWithTypeExclusively(node, 'e-page-with-url')) {
    return 'e-page-with-url-template'
  }
  if (isTemplateWithTypeExclusively(node, 'e-if')) {
    return 'e-if-template'
  }
  if (isTemplateWithTypeExclusively(node, 'e-for-each')) {
    return 'e-for-each-template'
  }
  if (isTemplateWithTypeExclusively(node, 'e-wrapper')) {
    return 'e-wrapper-template'
  }
  if (isTemplateWithTypeExclusively(node, 'e-ws')) {
    return 'e-ws-template'
  }
  if (isTemplate(node) && node.hasAttribute('is')) {
    return `${node.getAttribute('is')}-template`
  }
  return node.nodeName.toLowerCase()
}
