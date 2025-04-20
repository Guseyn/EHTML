import isTemplateWithType from 'ehtml/isTemplateWithType'

export default (node, type) => {
  if (node.nodeName.toLowerCase() === type) {
    throw new Error(`${type} must be <template>`)
  }
  return isTemplateWithType(node, type)
}
