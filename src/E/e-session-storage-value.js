export default (node) => {
  node.name = node.getAttribute('name')
  node.value = () => {
    return sessionStorage.getItem(
      node.getAttribute('data-key')
    )
  }
}
