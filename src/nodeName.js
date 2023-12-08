const isTemplateWithTypeExclusively = require('./isTemplateWithTypeExclusively')
const isTemplateWithType = require('./isTemplateWithType')

module.exports = (node) => {
  if (isTemplateWithType(node, 'e-json')) {
    return 'e-json-template'
  }
  if (isTemplateWithTypeExclusively(node, 'e-page-with-url')) {
    return 'e-page-with-url'
  }
  if (isTemplateWithTypeExclusively(node, 'e-if')) {
    return 'e-if'
  }
  if (isTemplateWithTypeExclusively(node, 'e-for-each')) {
    return 'e-for-each'
  }
  if (isTemplateWithTypeExclusively(node, 'e-wrapper')) {
    return 'e-wrapper'
  }
  return node.nodeName.toLowerCase()
}
