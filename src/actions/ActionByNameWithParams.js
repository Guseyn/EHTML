'use strict'

const { ResponseFromAjaxRequest, ResponseBody } = require('./../async-ajax/exports')
const { CreatedOptions } = require('./../async-object/exports')
const { ElementWithInnerHTML, ElementWithAdditionalHTML, ElementWithTextContent, HiddenElements, ShownElements, DisabledElements, EnabledElements, ElementWithMappedObject, ElementsWithToggledClass, ElementWithChangedValue, ElementWithChangedAttribute, ParsedElmSelectors, RemovedElements, ScrolledIntoView } = require('./../async-dom/exports')
const { Logged } = require('./../async-log/exports')
const { If } = require('./../async-if-else/exports')
const { RedirectedLocation, ReloadedLocation, TurboRedirected } = require('./../async-location/exports')
const { LocalStorageWithSetValue, SessionStorageWithSetValue, LocalStorageWithRemovedValue, SessionStorageWithRemovedValue } = require('./../async-storage/exports')
const { First } = require('./../async-array/exports')
const { EncodedURI } = require('./../async-uri/exports')

const actions = {
  if: (statement, action) => {
    return new If(statement, action)
  },

  logToConsole: (...objs) => {
    return new Logged(...objs)
  },

  mapToTemplate: (obj, elmSelector) => {
    return new ElementWithMappedObject(
      new First(
        new ParsedElmSelectors(elmSelector)
      ),
      obj
    )
  },

  redirect: (url) => {
    return new RedirectedLocation(new EncodedURI(url))
  },

  reload: () => {
    return new ReloadedLocation()
  },

  turboRedirect: (href, headers, { progressBarPlace, progressBarClassName, ajaxFavicon } = { }) => {
    return new TurboRedirected(href, headers, { progressBarPlace, progressBarClassName, ajaxFavicon })
  },

  saveToLocalStorage: (key, value) => {
    return new LocalStorageWithSetValue(localStorage, key, value)
  },

  saveToSessionStorage: (key, value) => {
    return new SessionStorageWithSetValue(sessionStorage, key, value)
  },

  removeFromLocalStorage: (key) => {
    return new LocalStorageWithRemovedValue(localStorage, key)
  },

  removeFromSessionStorage: (key, value) => {
    return new SessionStorageWithRemovedValue(sessionStorage, key)
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

  removeElms: (...elmSelectors) => {
    return new RemovedElements(
      new ParsedElmSelectors(...elmSelectors)
    )
  },

  toggleElms: (className, ...elmSelectors) => {
    return new ElementsWithToggledClass(
      className,
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

  innerHTMLFromResponse: (elmSelector, htmlStringFromObject) => {
    return new ElementWithInnerHTML(
      new First(
        new ParsedElmSelectors(elmSelector)
      ),
      htmlStringFromObject
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

  addHTMLFromResponse: (elmSelector, htmlStringFromObject) => {
    return new ElementWithAdditionalHTML(
      new First(
        new ParsedElmSelectors(elmSelector)
      ),
      htmlStringFromObject
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

  textContentFromResponse: (elmSelector, stringFromObject) => {
    return new ElementWithTextContent(
      new First(
        new ParsedElmSelectors(elmSelector)
      ),
      stringFromObject
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

  updateAttribute: (elmSelector, attrName, attrValue) => {
    return new ElementWithChangedAttribute(
      new First(
        new ParsedElmSelectors(elmSelector)
      ),
      attrName,
      attrValue
    )
  },

  scrollIntoView: (elmSelector) => {
    return new ScrolledIntoView(
      new First(
        new ParsedElmSelectors(elmSelector)
      )
    )
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
