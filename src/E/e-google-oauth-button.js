const responseFromAjaxRequest = require('./../responseFromAjaxRequest')
const evaluatedStringWithActionsOnResponse = require('./../evaluatedStringWithActionsOnResponse')

const GOOGLE_API_SRC = 'https://apis.google.com/js/api:client.js'

module.exports = (node) => {
  const button = replaceWithButton(node)
  const googleSignInMetaElmValue = googleSignInMetaElm(button)
  const googleApiScriptElmValue = googleApiScriptElm()
  document.head.prepend(googleSignInMetaElmValue, googleApiScriptElmValue)
  button.style.display = 'none'
  googleApiScriptElmValue.onload = () => {
    initGoogleOauth(button)
  }
}

function replaceWithButton (node) {
  const button = document.createElement('button')
  button.setAttribute('data-e-google-oauth-button', 'true')
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

function googleSignInMetaElm (button) {
  const googleSignInMetaElm = document.createElement('meta')
  googleSignInMetaElm.setAttribute('name', 'google-signin-client_id')
  googleSignInMetaElm.setAttribute('content', button.getAttribute('data-client-id'))
  return googleSignInMetaElm
}

function googleApiScriptElm () {
  const googleApiScriptElm = document.createElement('script')
  googleApiScriptElm.setAttribute('src', GOOGLE_API_SRC)
  return googleApiScriptElm
}

function initGoogleOauth (button) {
  button.style.display = ''
  // eslint-disable-next-line no-undef
  gapi.load('auth2', () => {
    // eslint-disable-next-line no-undef
    const auth2 = gapi.auth2.init({
      client_id: button.getAttribute('data-client-id'),
      cookiepolicy: button.getAttribute('data-cookiepolicy') || 'single_host_origin',
      scope: button.getAttribute('data-scope') || 'profile'
    })
    auth2.attachClickHandler(button, {},
      (googleUser) => {
        const body = {}
        body[button.getAttribute('data-request-token-key') || 'googleToken'] = googleUser.getAuthResponse().id_token
        responseFromAjaxRequest({
          url: encodeURI(button.getAttribute('data-redirect-url') || '/'),
          method: 'POST'
        }, JSON.stringify(body), (err, resObj) => {
          if (err) {
            throw err
          }
          const responseBodyAsBuffer = resObj.body
          const responseBodyAsObject = JSON.parse(
            responseBodyAsBuffer.toString('utf-8', 0, responseBodyAsBuffer.length)
          )
          evaluatedStringWithActionsOnResponse(
            button.getAttribute('data-actions-on-response'),
            button.getAttribute('data-response-name'),
            {
              body: responseBodyAsObject,
              statusСode: resObj.statusСode,
              headers: resObj.headers
            }
          )
        })
      },
      (error) => {
        throw error
      }
    )
  })
}
