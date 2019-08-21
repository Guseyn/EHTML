'use strict'

const { browserified } = require('@page-libs/cutie')
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { Value } = browserified(require('@cuties/object'))
const { ParsedJSON } = browserified(require('@cuties/json'))
const HTMLTunedElement = require('./HTMLTunedElement')
const LocalStorageWithSetValue = require('./async/LocalStorageWithSetValue')
const GOOGLE_API_SRC = 'https://apis.google.com/js/api:client.js'

class EGoogleOauthButton extends HTMLTunedElement {
  constructor () {
    super()
  }

  static get observedAttributes () {
    return ['data-client-id', 'data-cookiepolicy', 'data-scope', 'data-redirect-url', 'data-local-storage-jwt-key', 'data-response-jwt-key', 'data-request-token-key']
  }

  render () {
    const metaElm = this.metaElm()
    const scriptElm = this.scriptElm()
    document.head.prepend(metaElm, scriptElm)
    const button = this.replaceWithButton(this)
    const instance = this
    scriptElm.onload = () => {
      button.style['display'] = ''
      instance.initGoogleOauth(button)
    }
    this.rendered = true
  }

  initGoogleOauth (button) {
    const instance = this
    // eslint-disable-next-line no-undef
    gapi.load('auth2', () => {
      // eslint-disable-next-line no-undef
      const auth2 = gapi.auth2.init({
        client_id: instance.getAttribute('data-client-id'),
        cookiepolicy: instance.getAttribute('data-cookiepolicy') || 'single_host_origin',
        scope: instance.getAttribute('data-scope') || 'profile'
      })
      auth2.attachClickHandler(button, {},
        (googleUser) => {
          const body = {}
          body[instance.getAttribute('data-request-token-key') || 'googleToken'] = googleUser.getAuthResponse().id_token
          new LocalStorageWithSetValue(
            localStorage,
            instance.getAttribute('data-local-storage-jwt-key') || 'jwt',
            new Value(
              new ParsedJSON(
                new ResponseBody(
                  new ResponseFromAjaxRequest(
                    {
                      url: instance.getAttribute('data-redirect-url') || '/',
                      method: 'POST'
                    },
                    JSON.stringify(body)
                  )
                )
              ),
              instance.getAttribute('data-response-jwt-key') || 'jwt'
            )
          ).call()
        },
        (error) => {
          console.log(JSON.stringify(error, undefined, 2))
        }
      )
    })
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
    button.style['display'] = 'none'
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
}

window.customElements.define('e-google-oauth-button', EGoogleOauthButton)
