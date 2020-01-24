'use strict'

const E = require('./E')

class E_GITHUB_OAUTH_BUTTON extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    this.replaceWithButton()
    this.initGighubOauth()
  }

  replaceWithButton () {
    const button = document.createElement('button')
    button.setAttribute('data-e-github-oauth-button', 'true')
    for (let i = 0; i < this.node.attributes.length; i++) {
      button.setAttribute(
        this.node.attributes[i].name,
        this.node.attributes[i].value
      )
    }
    while (this.node.firstChild) {
      const child = this.node.removeChild(this.node.firstChild)
      button.appendChild(child)
    }
    this.node.parentNode.replaceChild(button, this.node)
    this.node = button
  }

  initGighubOauth () {
    const clientId = this.node.getAttribute('data-client-id')
    const redirectURI = this.node.getAttribute('data-redirect-uri')
    const scope = this.node.getAttribute('data-scope')
    this.node.addEventListener('click', () => {
      window.location = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scope}`
    })
  }
}

module.exports = E_GITHUB_OAUTH_BUTTON
