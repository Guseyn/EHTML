export default (node) => {
  const button = replaceWithButton(node)
  initGighubOauth(button)
}

function replaceWithButton (node) {
  const button = document.createElement('button')
  button.setAttribute('data-e-github-oauth-button', 'true')
  for (let i = 0; i < node.attributes.length; i++) {
    button.setAttribute(
      node.attributes[i].name,
      node.attributes[i].value
    )
  }
  while (node.firstChild) {
    const child = node.removeChild(node.firstChild)
    button.appendChild(child)
  }
  node.parentNode.replaceChild(button, node)
  return button
}

function initGighubOauth (button) {
  const clientId = button.getAttribute('data-client-id')
  const redirectURI = encodeURI(button.getAttribute('data-redirect-uri'))
  const scope = button.getAttribute('data-scope')
  button.addEventListener('click', () => {
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scope}`
  })
}
