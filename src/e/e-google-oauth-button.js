
'use strict'

const { browserified } = require('@page-libs/cutie')
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { ParsedJSON } = browserified(require('@cuties/json'))
const AppliedActions = require('./../async/AppliedActions')
const E = require('./../E')
const GOOGLE_API_SRC = 'https://apis.google.com/js/api:client.js'

class EGoogleOauthButton extends E {
  constructor () {
    super()
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
      'mapObjToElm',
      'hideElms',
      'showElms',
      'disableElms',
      'enableElms',
      'changeElmsClassName'
    ]
  }

  onRender () {
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
        client_id: this.attr('data-client-id'),
        cookiepolicy: this.attr('data-cookiepolicy') || 'single_host_origin',
        scope: this.attr('data-scope') || 'profile'
      })
      auth2.attachClickHandler(this, {},
        (googleUser) => {
          const body = {}
          body[this.attr('data-request-token-key') || 'googleToken'] = googleUser.getAuthResponse().id_token
          new AppliedActions(
            this.tagName,
            this.attr('data-object'),
            this.attr('data-actions'),
            this.supportedActions(),
            new ParsedJSON(
              new ResponseBody(
                new ResponseFromAjaxRequest(
                  {
                    url: this.attr('data-redirect-url') || '/',
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
    googleSignInMetaElm.setAttribute('content', this.attr('data-client-id'))
    return googleSignInMetaElm
  }

  googleApiScriptElm () {
    const googleApiScriptElm = document.createElement('script')
    googleApiScriptElm.setAttribute('src', GOOGLE_API_SRC)
    return googleApiScriptElm
  }
}

window.customElements.define('e-google-oauth-button', EGoogleOauthButton)

module.exports = EGoogleOauthButton