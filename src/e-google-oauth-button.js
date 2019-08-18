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
      const googleSignInMetaElm = document.createElement('meta')
      googleSignInMetaElm.setAttribute('name', 'google-signin-client_id')
      googleSignInMetaElm.setAttribute('content', this.getAttribute('data-client-id'))
      const googleApiScriptElm = document.createElement('script')
      googleApiScriptElm.setAttribute('src', GOOGLE_API_SRC)
      document.head.prepend(googleSignInMetaElm, googleApiScriptElm)
      /* eslint-disable no-undef */
      this.onclick = () => {
        console.log(gapi)
      }
      /* eslint-enable no-undef */
      this.rendered = true
    }
  }

  connectedCallback () {
    this.render()
  }
}

window.customElements.define('e-google-oauth-button', EGoogleOauthButton)
