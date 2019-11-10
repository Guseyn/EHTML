'use strict'

const { ResponseFromAjaxRequest, ResponseBody } = require('./../async-ajax/exports')
const { CreatedOptions } = require('./../async-object/exports')
const { ElementWithInnerHTML, ElementWithAdditionalHTML, ElementWithTextContent, HiddenElements, ShownElements, DisabledElements, EnabledElements, ElementWithMappedObjectAndAppliedVariables, ElementsWithToggledClass, ElementWithChangedValue, ParsedElmSelectors } = require('./../async-dom/exports')
const { Logged } = require('./../async-log/exports')
const { If } = require('./../async-if-else/exports')
const { RedirectedLocation, TurboRedirected } = require('./../async-location/exports')
const { LocalStorageWithSetValue, SessionStorageWithSetValue } = require('./../async-storage/exports')
const { First } = require('./../async-array/exports')
const { EncodedURI } = require('./../async-uri/exports')

const actions = {
  if: (statement, action) => {
    return new If(statement, action)
  },

  logToConsole: (...objs) => {
    return new Logged(...objs)
  },

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
      new First(
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
      new First(
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
      new First(
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
      new First(
        new ParsedElmSelectors(elmSelector)
      ),
      newValue
    )
  },

  mapObjToElm: (obj, elmSelector) => {
    return new ElementWithMappedObjectAndAppliedVariables(
      new First(
        new ParsedElmSelectors(elmSelector)
      ),
      obj,
      'data-object-name'
    )
  },

  toggleElms: (className, ...elmSelectors) => {
    return new ElementsWithToggledClass(
      className,
      new ParsedElmSelectors(...elmSelectors)
    )
  },

  turboRedirect: (href, headers, { progressBarPlace, progressBarClassName, ajaxFavicon } = { }) => {
    return new TurboRedirected(href, headers, { progressBarPlace, progressBarClassName, ajaxFavicon })
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
