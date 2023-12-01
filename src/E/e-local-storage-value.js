module.exports = (node) => {
  node.name = node.getAttribute('name')
  node.value = () => {
    return localStorage.getItem(
      node.getAttribute('data-key')
    )
  }
}
