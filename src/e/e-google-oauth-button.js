
'use strict'

const { browserified } = require('@page-libs/cutie')
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { ParsedJSON } = browserified(require('@cuties/json'))
const AppliedActionsOnResponse = require('./../async/AppliedActionsOnResponse')
const E = require('./../E')
const GOOGLE_API_SRC = 'https://apis.google.com/js/api:client.js'

class EGoogleOauthButton extends E {
  constructor () {
    super()
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
        client_id: this.getAttribute('data-client-id'),
        cookiepolicy: this.getAttribute('data-cookiepolicy') || 'single_host_origin',
        scope: this.getAttribute('data-scope') || 'profile'
      })
      auth2.attachClickHandler(this, {},
        (googleUser) => {
          const body = {}
          body[this.getAttribute('data-request-token-key') || 'googleToken'] = googleUser.getAuthResponse().id_token
          new AppliedActionsOnResponse(
            this.tagName,
            this.getAttribute('data-response-object-name'),
            this.getAttribute('data-actions-on-response'),
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

window.customElements.define('e-google-oauth-button', EGoogleOauthButton)

module.exports = EGoogleOauthButton
