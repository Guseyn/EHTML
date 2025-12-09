import isTemplateWithType from '#ehtml/isTemplateWithType.js?v=32c9a935'

export default function (node, type) {
  if (node.nodeName.toLowerCase() === type) {
    throw new Error(`${type} must be <template>`)
  }
  return isTemplateWithType(node, type)
}
