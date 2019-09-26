'use strict'

const ActionByNameWithParams = require('./util/ActionByNameWithParams')

if (!sessionStorage.getItem('isFirstStatePushedToHistory')) {
  sessionStorage.setItem('isFirstStatePushedToHistory', 'false')
}

const retrievedValue = (target, value) => {
  if (value instanceof Function) {
    return value(target)
  }
  return value
}

window.onpopstate = (event) => {
  if (event.state) {
    document.body.innerHTML = event.state.body
    document.title = event.state.title
  }
}

window.onbeforeunload = () => {
  sessionStorage.removeItem('isFirstStatePushedToHistory')
}

window.innerHTML = (target, elm, url, headers) => {
  new ActionByNameWithParams(
    'innerHTML',
    retrievedValue(target, elm),
    retrievedValue(target, url),
    retrievedValue(target, headers)
  ).value().call()
}

window.addHTMLTo = (target, elm, url, headers) => {
  new ActionByNameWithParams(
    'addHTMLTo',
    retrievedValue(target, elm),
    retrievedValue(target, url),
    retrievedValue(target, headers)
  ).value().call()
}

window.textContent = (target, elm, url, headers) => {
  new ActionByNameWithParams(
    'textContent',
    retrievedValue(target, elm),
    retrievedValue(target, url),
    retrievedValue(target, headers)
  ).value().call()
}

window.turboRedirect = (target, href, headers) => {
  new ActionByNameWithParams(
    'turboRedirect',
    retrievedValue(target, href),
    retrievedValue(target, headers)
  ).value().call()
}
