
'use strict'

const { browserified, as } = require('@page-libs/cutie')
const { ResponseFromAjaxRequest, ResponseBody, ResponseHeaders, ResponseStatusCode } = require('@page-libs/ajax')
const { StringFromBuffer } = browserified(require('@cuties/buffer'))
const { ParsedJSON } = browserified(require('@cuties/json'))
const AppliedActionsOnResponse = require('./../async/AppliedActionsOnResponse')
const E = require('./../E')
const GOOGLE_API_SRC = 'https://apis.google.com/js/api:client.js'

E(
  'e-google-oauth-button',
  class extends HTMLButtonElement {
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
            new ResponseFromAjaxRequest(
              {
                url: this.getAttribute('data-redirect-url') || '/',
                method: 'POST'
              },
              JSON.stringify(body)
            ).as('RESPONSE').after(
              new AppliedActionsOnResponse(
                this.tagName,
                this.getAttribute('data-response-object-name') || 'responseObject',
                new ParsedJSON(
                  new StringFromBuffer(
                    new ResponseBody(
                      as('RESPONSE')
                    )
                  )
                ),
                this.getAttribute('data-response-headers-name') || 'responseHeaders',
                new ResponseHeaders(
                  as('RESPONSE')
                ),
                this.getAttribute('data-response-status-code-name') || 'responseStatusCode',
                new ResponseStatusCode(
                  as('RESPONSE')
                ),
                this.getAttribute('data-actions-on-response')
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
  },
  { extends: 'button' }
)
