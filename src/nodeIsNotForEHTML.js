module.exports = (node) => {
  if (node.parentElement && node.parentElement.closest('[data-no-ehtml="true"]')) {
    return true
  }
  if (node.attributes) {
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i]
      if ((attr.name === 'data-no-ehtml') && (attr.value === 'true')) {
        return true
      }
    }
  }
  return false
}
