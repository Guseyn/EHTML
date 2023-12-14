const isTemplate = require('./isTemplate')
const isTemplateWithType = require('./isTemplateWithType')

module.exports = (node) => {
  if (!isTemplate(node)) {
    return false
  }
  if (!node.hasAttribute('is')) {
    return true
  }
  return isTemplateWithType(node, 'e-json') ||
    isTemplateWithType(node, 'e-ws') ||
    isTemplateWithType(node, 'e-reusable')
}
