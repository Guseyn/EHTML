export default (node) => {
  const select = replaceWithSelect(node)
  const value = select.getAttribute('value')
  for (let index = 0; index < select.options.length; index++) {
    const item = select.options.item(index)
    if (item.value === value) {
      item.setAttribute('selected', true)
      break
    }
  }
}

function replaceWithSelect (node) {
  const select = document.createElement('select')
  select.setAttribute('data-e-select', 'true')
  for (let i = 0; i < node.attributes.length; i++) {
    select.setAttribute(
      node.attributes[i].name,
      node.attributes[i].value
    )
  }
  while (node.firstChild) {
    const child = node.removeChild(node.firstChild)
    select.appendChild(child)
  }
  node.parentNode.replaceChild(select, node)
  return select
}
