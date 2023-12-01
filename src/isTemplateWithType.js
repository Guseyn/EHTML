const isTemplate = require('./isTemplate')

module.exports = (node, type) => {
  if (isTemplate(node)) {
    const templateType = node.getAttribute('is')
    if (templateType) {
      return templateType === type
    }
    return false
  }
  return false
}
