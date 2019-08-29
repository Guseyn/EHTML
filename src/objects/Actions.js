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
const ElementWithAppliedDataTextAndValueAttributesForChildNodes = require('./../async/ElementWithAppliedDataTextAndValueAttributesForChildNodes')
const ElementsWithChangedClass = require('./../async/ElementsWithChangedClass')
const paramRegExp = /\$\{(\S*)\}/g

class Actions {
  constructor (tagName, actionsCommand, supportedActions) {
    this.tagName = tagName
    this.actionsCommand = actionsCommand
    this.supportedActions = supportedActions
  }

  // PUBLIC

  run (values) {

  }

  // ACTIONS

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

  innerHTML (elmSelector, url, headers) {
    return new ElementWithInnerHTML(
      this.parseElmSelectors(elmSelector)[0],
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

  applyTextsAndValuesToChildNodes (elmSelector, values) {
    return new ElementWithAppliedDataTextAndValueAttributesForChildNodes(
      this.parseElmSelectors(elmSelector)[0], values
    )
  }

  changeElmsClassName (newClassName, ...elmSelectors) {
    return new ElementsWithChangedClass(...this.parseElmSelectors(...elmSelectors))
  }

  // PRIVATE

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

  parseCommands (values) {
    // act1(p1, p2); act(q1, q2); ...
    const commands = this.actionsCommand.split(';').map(command => command.trim())
    commands.forEach(command => {
      if (this.supportedActions.indexOf(command) === -1) {
        throw new Error(`${command} is not supported for the element ${this.tagName}`)
      }
      // const commandName = command.split('(')[0].trim()
      // TODO
      // const commandParams =
    })
  }

  runCommand () {

  }

  applyValuesToParam (param, values) {
    param.replace(paramRegExp, (match, p1, offset, string) => {
      try {
        // eslint-disable-next-line no-eval
        return eval(`values.${p1}`)
      } catch (e) {
        return match
      }
    })
  }
}

module.exports = Actions
