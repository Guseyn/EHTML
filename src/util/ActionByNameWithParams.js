'use strict'

const { browserified, as } = require('@page-libs/cutie')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { ElementWithInnerHTML, ElementWithAdditionalHTML, ElementWithTextContent } = require('@page-libs/dom')
const { StringFromBuffer } = browserified(require('@cuties/buffer'))
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
const ParsedJSONOrString = require('./../async/ParsedJSONOrString')
const EncodedURI = require('./../async/EncodedURI')
const ExtractedDocument = require('./../async/ExtractedDocument')
const BodyInnerHTMLOfDocument = require('./../async/BodyInnerHTMLOfDocument')
const TitleOfDocument = require('./../async/TitleOfDocument')
const PushedStateToHistory = require('./../async/PushedStateToHistory')
const ChangedPageTitle = require('./../async/ChangedPageTitle')

const actions = {
  redirect: (url) => {
    return new RedirectedLocation(new EncodedURI(url))
  },

  saveToLocalStorage: (key, value) => {
    return new LocalStorageWithSetValue(localStorage, key, value)
  },

  saveToSessionStorage: (key, value) => {
    // eslint-disable-next-line no-undef
    return new SessionStorageWithSetValue(sessionStorageWrapper, key, value)
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
            'headers', new ParsedJSONOrString(
              headers || '{}'
            )
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
            'headers', new ParsedJSONOrString(
              headers || '{}'
            )
          )
        )
      )
    )
  },

  textContent: (elmSelector, text) => {
    return new ElementWithTextContent(
      new FirstOf(
        new ParsedElmSelectors(elmSelector)
      ),
      text
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
      ), obj
    )
  },

  toggleElms: (className, ...elmSelectors) => {
    return new ElementsWithToggledClass(
      className,
      new ParsedElmSelectors(...elmSelectors)
    )
  },

  turboRedirect: (href, headers) => {
    return new ExtractedDocument(
      new StringFromBuffer(
        new ResponseBody(
          new ResponseFromAjaxRequest(
            new CreatedOptions(
              'url', href,
                'method', 'GET',
                'headers', headers
              )
            )
          )
        )
      ).as('DOC').after(
        new BodyInnerHTMLOfDocument(
          as('DOC')
        ).as('BODY').after(
          new TitleOfDocument(
            as('DOC')
          ).as('TITLE').after(
            new PushedStateToHistory(
              new CreatedOptions(
                'body', as('BODY'),
                'title', as('TITLE')
              ),
              href
            ).after(
              new ElementWithInnerHTML(
                document.body,
                as('BODY')
              ).after(
                new ChangedPageTitle(
                  document,
                  as('TITLE')
                )
              )
            )
          )
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
      throw new Error(`no such action with name ${this.name}`)
    }
    return actions[this.name](...this.params)
  }
}

module.exports = ActionByNameWithParams
