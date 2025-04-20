import evaluatedStringWithParamsFromState from 'ehtml/evaluatedStringWithParamsFromState'

export default (node) => {
  node.style.display = 'none'
  node.name = node.getAttribute('name')
  node.value = () => {
    return evaluatedStringWithParamsFromState(
      node.getAttribute('data-bound-to'),
      node.__ehtmlState__,
      node
    )
  }
}
