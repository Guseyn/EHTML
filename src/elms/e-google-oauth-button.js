'use strict'

const { browserified } = require('@page-libs/cutie')
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { ParsedJSON } = browserified(require('@cuties/json'))
const HTMLTunedElement = require('./../global-objects/HTMLTunedElement')
const GOOGLE_API_SRC = 'https://apis.google.com/js/api:client.js'

class EGoogleOauthButton extends HTMLTunedElement {
  constructor () {
    super()
    this.values = {}
  }

  static get observedAttributes () {
    return [
      'data-client-id',
      'data-cookiepolicy',
      'data-scope',
      'data-redirect-url',
      'data-local-storage-jwt-key'
    ]
  }

  supportedActions () {
    return [
      'redirect',
      'saveToLocalStorage',
      'saveToMemoryStorage',
      'innerHTML',
      'addHTMLTo',
      'applyValuesToChildNodes',
      'hideElms',
      'showElms',
      'disableElms',
      'enableElms',
      'changeElmsClassName'
    ]
  }

  render () {
    const googleSignInMetaElm = this.googleSignInMetaElm()
    const googleApiScriptElm = this.googleApiScriptElm()
    document.head.prepend(googleSignInMetaElm, googleApiScriptElm)
    this.style['display'] = 'none'
    googleApiScriptElm.onload = () => {
      this.initGoogleOauth()
    }
    this.rendered = true
  }

  initGoogleOauth () {
    this.style['display'] = ''
    // eslint-disable-next-line no-undef
    gapi.load('auth2', () => {
      // eslint-disable-next-line no-undef
      const auth2 = gapi.auth2.init({
        client_id: this.getAttribute('data-client-id'),
        cookiepolicy: this.getAttribute('data-cookiepolicy') || 'single_host_origin',
        scope: this.getAttribute('data-scope') || 'profile'
      })
      auth2.attachClickHandler(this, {},
        (googleUser) => {
          const body = {}
          body[this.getAttribute('data-request-token-key') || 'googleToken'] = googleUser.getAuthResponse().id_token
          this.appliedActions(
            new ParsedJSON(
              new ResponseBody(
                new ResponseFromAjaxRequest(
                  {
                    url: this.getAttribute('data-redirect-url') || '/',
                    method: 'POST'
                  },
                  JSON.stringify(body)
                )
              )
            )
          ).call()
        },
        (error) => {
          console.log(JSON.stringify(error, undefined, 2))
        }
      )
    })
  }

  googleSignInMetaElm () {
    const googleSignInMetaElm = document.createElement('meta')
    googleSignInMetaElm.setAttribute('name', 'google-signin-client_id')
    googleSignInMetaElm.setAttribute('content', this.getAttribute('data-client-id'))
    return googleSignInMetaElm
  }

  googleApiScriptElm () {
    const googleApiScriptElm = document.createElement('script')
    googleApiScriptElm.setAttribute('src', GOOGLE_API_SRC)
    return googleApiScriptElm
  }
}

module.exports = EGoogleOauthButton
