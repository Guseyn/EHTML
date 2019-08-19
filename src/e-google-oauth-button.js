const GOOGLE_API_SRC = 'https://apis.google.com/js/api:client.js'

class EGoogleOauthButton extends HTMLElement {
  constructor () {
    super()
    this.rendered = false
  }

  static get observedAttributes () {
    return ['data-client-id']
  }

  render () {
    if (!this.rendered) {
      document.head.prepend(this.metaElm(), this.scriptElm())
      this.replaceWithButton(this)
      this.rendered = true
    }
  }

  metaElm () {
    const googleSignInMetaElm = document.createElement('meta')
    googleSignInMetaElm.setAttribute('name', 'google-signin-client_id')
    googleSignInMetaElm.setAttribute('content', this.getAttribute('data-client-id'))
    return googleSignInMetaElm
  }

  scriptElm () {
    const googleApiScriptElm = document.createElement('script')
    googleApiScriptElm.setAttribute('src', GOOGLE_API_SRC)
    return googleApiScriptElm
  }

  replaceWithButton (googleOauthButton) {
    const button = document.createElement('button')
    this.copyAttributes(button, googleOauthButton)
    this.moveChildren(button, googleOauthButton)
    return button
  }

  copyAttributes (toElm, fromElm) {
    fromElm.getAttributeNames().forEach(name => {
      toElm.setAttribute(name, fromElm.getAttribute(name))
    })
  }

  moveChildren (toElm, fromElm) {
    while (fromElm.firstChild) {
      const child = fromElm.removeChild(fromElm.firstChild)
      toElm.appendChild(child)
    }
    fromElm.parentNode.replaceChild(toElm, fromElm)
  }

  connectedCallback () {
    const self = this
    setTimeout(() => {
      self.render()
    })
  }
}

window.customElements.define('e-google-oauth-button', EGoogleOauthButton)
