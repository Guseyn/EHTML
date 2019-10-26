'use strict'

const { browserified } = require('@page-libs/cutie')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { ElementWithInnerHTML, ElementWithAdditionalHTML, ElementWithTextContent } = require('@page-libs/dom')
const RedirectedLocation = require('./../async/RedirectedLocation')
const LocalStorageWithSetValue = require('./../async/LocalStorageWithSetValue')
const SessionStorageWithSetValue = require('./../async/SessionStorageWithSetValue')
const HiddenElements = require('./../async/HiddenElements')
const ShownElements = require('./../async/ShownElements')
const DisabledElements = require('./../async/DisabledElements')
const EnabledElements = require('./../async/EnabledElements')
const ElementWithMappedObject = require('./../async/ElementWithMappedObject')
const ElementsWithToggledClass = require('./../async/ElementsWithToggledClass')
const ElementWithChangedValue = require('./../async/ElementWithChangedValue')
const FirstOf = require('./../async/FirstOf')
const ParsedElmSelectors = require('./../async/ParsedElmSelectors')
const EncodedURI = require('./../async/EncodedURI')
const TurboRedirected = require('./../async/TurboRedirected')

const actions = {
  redirect: (url) => {
    return new RedirectedLocation(new EncodedURI(url))
  },

  saveToLocalStorage: (key, value) => {
    return new LocalStorageWithSetValue(localStorage, key, value)
  },

  saveToSessionStorage: (key, value) => {
    return new SessionStorageWithSetValue(sessionStorage, key, value)
  },

  hideElms: (...elmSelectors) => {
    return new HiddenElements(
      new ParsedElmSelectors(...elmSelectors)
    )
  },

  showElms: (...elmSelectors) => {
    return new ShownElements(
      new ParsedElmSelectors(...elmSelectors)
    )
  },

  disableElms: (...elmSelectors) => {
    return new DisabledElements(
      new ParsedElmSelectors(...elmSelectors)
    )
  },

  enableElms: (...elmSelectors) => {
    return new EnabledElements(
      new ParsedElmSelectors(...elmSelectors)
    )
  },

  innerHTML: (elmSelector, url, headers) => {
    return new ElementWithInnerHTML(
      new FirstOf(
        new ParsedElmSelectors(elmSelector)
      ),
      new ResponseBody(
        new ResponseFromAjaxRequest(
          new CreatedOptions(
            'url', new EncodedURI(url),
            'method', 'GET',
            'headers', headers
          )
        )
      )
    )
  },

  addHTMLTo: (elmSelector, url, headers) => {
    return new ElementWithAdditionalHTML(
      new FirstOf(
        new ParsedElmSelectors(elmSelector)
      ),
      new ResponseBody(
        new ResponseFromAjaxRequest(
          new CreatedOptions(
            'url', new EncodedURI(url),
            'method', 'GET',
            'headers', headers
          )
        )
      )
    )
  },

  textContent: (elmSelector, url, headers) => {
    return new ElementWithTextContent(
      new FirstOf(
        new ParsedElmSelectors(elmSelector)
      ),
      new ResponseBody(
        new ResponseFromAjaxRequest(
          new CreatedOptions(
            'url', new EncodedURI(url),
            'method', 'GET',
            'headers', headers
          )
        )
      )
    )
  },

  changeValueOf: (elmSelector, newValue) => {
    return new ElementWithChangedValue(
      new FirstOf(
        new ParsedElmSelectors(elmSelector)
      ),
      newValue
    )
  },

  mapObjToElm: (obj, elmSelector) => {
    return new ElementWithMappedObject(
      new FirstOf(
        new ParsedElmSelectors(elmSelector)
      ),
      obj,
      'data-response-object-name'
    )
  },

  mapHeadersToElm: (headers, elmSelector) => {
    return new ElementWithMappedObject(
      new FirstOf(
        new ParsedElmSelectors(elmSelector)
      ),
      headers,
      'data-response-headers-name'
    )
  },

  mapStatusCodeToElm: (statusCode, elmSelector) => {
    return new ElementWithMappedObject(
      new FirstOf(
        new ParsedElmSelectors(elmSelector)
      ),
      statusCode,
      'data-response-status-code-name'
    )
  },

  toggleElms: (className, ...elmSelectors) => {
    return new ElementsWithToggledClass(
      className,
      new ParsedElmSelectors(...elmSelectors)
    )
  },

  turboRedirect: (href, headers, { progressBarClassName, ajaxFavicon }) => {
    return new TurboRedirected(href, headers, { progressBarClassName, ajaxFavicon })
  }
}

class ActionByNameWithParams {
  constructor (name, ...params) {
    this.name = name
    this.params = params
  }

  value () {
    if (!actions[this.name]) {
      throw new Error(`no such action with name "${this.name}"`)
    }
    return actions[this.name](...this.params)
  }
}

module.exports = ActionByNameWithParams
