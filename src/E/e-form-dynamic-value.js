const evaluatedStringWithParams = require('./../evaluatedStringWithParams')

module.exports = (node) => {
  node.style.display = 'none'
  node.name = node.getAttribute('name')
  node.value = () => {
    return evaluatedStringWithParams(
      node.getAttribute('data-bound-to')
    )
  }
}
