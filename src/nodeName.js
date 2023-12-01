const isTemplateWithTypeExclusively = require('./isTemplateWithTypeExclusively')
const isTemplateWithType = require('./isTemplateWithType')

module.exports = (node) => {
  if (isTemplateWithType(node, 'e-json')) {
    return 'e-json-template'
  } else if (isTemplateWithTypeExclusively(node, 'e-page-with-url')) {
    return 'e-page-with-url'
  } else if (isTemplateWithTypeExclusively(node, 'e-if')) {
    return 'e-if'
  } else if (isTemplateWithTypeExclusively(node, 'e-for-each')) {
    return 'e-for-each'
  } else if (isTemplateWithTypeExclusively(node, 'e-wrapper')) {
    return 'e-wrapper'
  } else if (isTemplateWithTypeExclusively(node, 'e-cache-version')) {
    return 'e-cache-version'
  }
  return node.nodeName.toLowerCase()
}
