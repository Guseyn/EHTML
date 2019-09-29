'use strict'

const ActionByNameWithParams = require('./util/ActionByNameWithParams')

if (!window.customElements) {
  window.stop()
  throw new Error('Your browser does not support custom elements so you cannot use EHTML as it\'s based on them.')
}

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

window.redirect = (target, url) => {
  new ActionByNameWithParams(
    'redirect',
    retrievedValue(target, url)
  ).value().call()
}

window.saveToLocalStorage = (target, key, value) => {
  new ActionByNameWithParams(
    'saveToLocalStorage',
    retrievedValue(target, key),
    retrievedValue(target, value)
  ).value().call()
}

window.saveToSessionStorage = (target, key, value) => {
  new ActionByNameWithParams(
    'saveToSessionStorage',
    retrievedValue(target, key),
    retrievedValue(target, value)
  ).value().call()
}

window.hideElms = (...elmSelectors) => {
  new ActionByNameWithParams(
    'hideElms',
    ...elmSelectors
  ).value().call()
}

window.showElms = (...elmSelectors) => {
  new ActionByNameWithParams(
    'showElms',
    ...elmSelectors
  ).value().call()
}

window.disableElms = (...elmSelectors) => {
  new ActionByNameWithParams(
    'disableElms',
    ...elmSelectors
  ).value().call()
}

window.enableElms = (...elmSelectors) => {
  new ActionByNameWithParams(
    'enableElms',
    ...elmSelectors
  ).value().call()
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

window.changeValueOf = (target, elmSelector, newValue) => {
  new ActionByNameWithParams(
    'changeValueOf',
    elmSelector,
    retrievedValue(target, newValue)
  ).value().call()
}

window.mapObjToElm = (target, obj, elmSelector) => {
  new ActionByNameWithParams(
    'mapObjToElm',
    retrievedValue(target, obj),
    elmSelector
  ).value().call()
}

window.toggleElms = (className, ...elmSelectors) => {
  new ActionByNameWithParams(
    'toggleElms',
    className,
    ...elmSelectors
  ).value().call()
}

window.turboRedirect = (target, href, headers) => {
  new ActionByNameWithParams(
    'turboRedirect',
    retrievedValue(target, href),
    retrievedValue(target, headers)
  ).value().call()
}
