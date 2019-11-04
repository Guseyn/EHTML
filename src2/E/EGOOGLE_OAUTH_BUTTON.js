'use strict'

const E = require('./E')
const { as } = require('./../cutie/exports')
const { ResponseFromAjaxRequest, ResponseBody, ResponseHeaders, ResponseStatusCode, JSResponseByHTTPReponseComponents } = require('./../async-ajax/exports')
const { StringFromBuffer } = require('./../async-string/exports')
const { ParsedJSON } = require('./../async-json/exports')
const { AppliedActionsOnResponse } = require('./../actions/exports')
const GOOGLE_API_SRC = 'https://apis.google.com/js/api:client.js'

class EGOOGLE_OAUTH_BUTTON extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    this.replaceWithButton()
    const googleSignInMetaElm = this.googleSignInMetaElm()
    const googleApiScriptElm = this.googleApiScriptElm()
    document.head.prepend(googleSignInMetaElm, googleApiScriptElm)
    this.node.style.display = 'none'
    googleApiScriptElm.onload = () => {
      this.initGoogleOauth()
    }
  }

  replaceWithButton () {
    const button = document.createElement('button')
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

  initGoogleOauth () {
    this.node.style.display = ''
    // eslint-disable-next-line no-undef
    gapi.load('auth2', () => {
      // eslint-disable-next-line no-undef
      const auth2 = gapi.auth2.init({
        client_id: this.node.getAttribute('data-client-id'),
        cookiepolicy: this.node.getAttribute('data-cookiepolicy') || 'single_host_origin',
        scope: this.node.getAttribute('data-scope') || 'profile'
      })
      auth2.attachClickHandler(this.node, {},
        (googleUser) => {
          const body = {}
          body[this.node.getAttribute('data-request-token-key') || 'googleToken'] = googleUser.getAuthResponse().id_token
          new ResponseFromAjaxRequest(
            {
              url: this.node.getAttribute('data-redirect-url') || '/',
              method: 'POST'
            },
            JSON.stringify(body)
          ).as('RESPONSE').after(
            new AppliedActionsOnResponse(
              this.node.tagName,
              this.node.getAttribute('data-response-name') || 'response',
              new JSResponseByHTTPReponseComponents(
                new ParsedJSON(
                  new StringFromBuffer(
                    new ResponseBody(
                      as('RESPONSE')
                    )
                  )
                ),
                new ResponseHeaders(
                  as('RESPONSE')
                ),
                new ResponseStatusCode(
                  as('RESPONSE')
                )
              ),
              this.node.getAttribute('data-actions-on-response')
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
    googleSignInMetaElm.setAttribute('content', this.node.getAttribute('data-client-id'))
    return googleSignInMetaElm
  }

  googleApiScriptElm () {
    const googleApiScriptElm = document.createElement('script')
    googleApiScriptElm.setAttribute('src', GOOGLE_API_SRC)
    return googleApiScriptElm
  }
}

module.exports = EGOOGLE_OAUTH_BUTTON
