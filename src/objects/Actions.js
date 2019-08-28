'use strict'

const { browserified } = require('@page-libs/cutie')
const { CreatedOptions } = browserified(require('@cuties/object'))
const { ParsedJSON } = browserified(require('@cuties/json'))
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { ElementWithInnerHTML } = require('@page-libs/dom')
const RedirectAction = require('./../async/RedirectAction')
const LocalStorageWithSetValue = require('./../async/LocalStorageWithSetValue')
const MemoryStorageWithSetValue = require('./../async/MemoryStorageWithSetValue')
const HiddenElements = require('./../async/HiddenElements')
const ShownElements = require('./../async/ShownElements')
const DisabledElements = require('./../async/DisabledElements')
const EnabledElements = require('./../async/EnabledElements')
const ElementsWithAppliedDataTextAndValueAttributesForChildNodes = require('./../async/ElementsWithAppliedDataTextAndValueAttributesForChildNodes')
const ElementsWithChangedClass = require('./../async/ElementsWithChangedClass')

class Actions {
  constructor (actionsCommand) {
    this.actionsCommand = actionsCommand
  }

  run () {

  }

  redirect (url) {
    return new RedirectAction(url)
  }

  saveToLocalStorage (key, value) {
    return new LocalStorageWithSetValue(key, value)
  }

  saveToMemoryStorage (key, value) {
    return new MemoryStorageWithSetValue(key, value)
  }

  hideElms (...elmSelectors) {
    return new HiddenElements(...this.parseElmSelectors(...elmSelectors))
  }

  showElms (...elmSelectors) {
    return new ShownElements(...this.parseElmSelectors(...elmSelectors))
  }

  disableElms (...elmSelectors) {
    return new DisabledElements(...this.parseElmSelectors(...elmSelectors))
  }

  enableElms (...elmSelectors) {
    return new EnabledElements(...this.parseElmSelectors(...elmSelectors))
  }

  innerHTML (elmId, url, headers) {
    return new ElementWithInnerHTML(
      this.parseElmSelectors(elmId)[0],
      new ResponseBody(
        new ResponseFromAjaxRequest(
          new CreatedOptions(
            'url', this.getAttribute(url),
            'method', 'GET',
            'headers', new ParsedJSON(
              headers || '{}'
            )
          )
        )
      )
    )
  }

  applyTextsAndValuesToChildNodes (values, ...elmSelectors) {
    return new ElementsWithAppliedDataTextAndValueAttributesForChildNodes(
      values, ...this.parseElmSelectors(...elmSelectors)
    )
  }

  changeElmsClassName (newClassName, ...elmSelectors) {
    return new ElementsWithChangedClass(...this.parseElmSelectors(...elmSelectors))
  }

  parseElmSelectors (...elmSelectors) {
    const elms = []
    elmSelectors.forEach(elmSelector => {
      if (new RegExp(/^#(\S+)$/g).test(elmSelector)) {
        elms.push(document.getElementById(elmSelector.split('#')[1]))
      } else if (new RegExp(/^\.(\S+)$/g).test(elmSelector)) {
        this.pushElms(elms, document.getElementsByClassName(elmSelector.split('.')[1]))
      } else if (new RegExp(/^(\S+)$/g).test(elmSelector)) {
        this.pushElms(elms, document.getElementsByTagName(elmSelector))
      }
    })
    return elms
  }

  pushElms (elms, elmsToPush) {
    for (let i = 0; i < elmsToPush.length; i++) {
      elms.push(elmsToPush[i])
    }
  }
}

module.exports = Actions
