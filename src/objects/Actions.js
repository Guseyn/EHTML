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
const BuiltAsyncTreeByParsedCommands = require('./../objects/BuiltAsyncTreeByParsedCommands')
const ParsedElmSelectors = require('./../objects/ParsedElmSelectors')
const ParamWithAppliedValues = require('./../objects/ParamWithAppliedValues')
const ParamWithAppliedLocalStorage = require('./../objects/ParamWithAppliedLocalStorage')
const ParamWithAppliedMemoryStorage = require('./../objects/ParamWithAppliedMemoryStorage')

class Actions {
  constructor (tagName, actionsCommand, supportedActions) {
    this.tagName = tagName
    this.actionsCommand = actionsCommand
    this.supportedActions = supportedActions
  }

  // PUBLIC

  asyncTree (values) {
    // act1(p1, p2); act(q1, q2); ...
    const commands = this.actionsCommand.split(';').map(command => command.trim())
    const parsedCommands = []
    commands.forEach(command => {
      const commandName = command.split('(')[0].trim()
      if (this.supportedActions.indexOf(commandName) === -1) {
        throw new Error(`command ${commandName} is not supported for the element ${this.tagName}`)
      }
      const commandParams = command.replace(')', '')
        .split(`${commandName}(`)[1]
        .split(',')
        .map(param => param.trim())
      switch (commandName) {
        case 'redirect':
          parsedCommands.push(this.redirect(commandParams[0]))
          break
        case 'saveToLocalStorage':
          parsedCommands.push(
            this.saveToLocalStorage(
              commandParams[0],
              new ParamWithAppliedLocalStorage(
                new ParamWithAppliedMemoryStorage(
                  new ParamWithAppliedValues(commandParams[1], values)
                )
              ).value()
            )
          )
          break
        case 'saveToMemoryStorage':
          parsedCommands.push(
            this.saveToMemoryStorage(
              commandParams[0],
              new ParamWithAppliedLocalStorage(
                new ParamWithAppliedMemoryStorage(
                  new ParamWithAppliedValues(commandParams[1], values)
                )
              ).value()
            )
          )
          break
        case 'innerHTML':
          parsedCommands.push(
            this.innerHTML(
              commandParams[0],
              new ParamWithAppliedLocalStorage(
                new ParamWithAppliedMemoryStorage(
                  new ParamWithAppliedValues(commandParams[1], values)
                )
              ).value(),
              new ParamWithAppliedLocalStorage(
                new ParamWithAppliedMemoryStorage(
                  new ParamWithAppliedValues(commandParams[2], values)
                )
              ).value()
            )
          )
          break
        case 'applyTextsAndValuesToChildNodes':
          parsedCommands.push(
            this.applyTextsAndValuesToChildNodes(
              commandParams[0],
              values
            )
          )
          break
        case 'hideElms':
        case 'showElms':
        case 'disableElms':
        case 'enableElms':
        case 'changeElmsClassName':
          parsedCommands.push(this[commandName](...commandParams))
          break
        default:
          throw new Error(`command ${command} does not exists`)
      }
    })
    return new BuiltAsyncTreeByParsedCommands(parsedCommands).value()
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
    return new HiddenElements(...new ParsedElmSelectors(...elmSelectors).value())
  }

  showElms (...elmSelectors) {
    return new ShownElements(...new ParsedElmSelectors(...elmSelectors).value())
  }

  disableElms (...elmSelectors) {
    return new DisabledElements(...new ParsedElmSelectors(...elmSelectors).value())
  }

  enableElms (...elmSelectors) {
    return new EnabledElements(...new ParsedElmSelectors(...elmSelectors).value())
  }

  innerHTML (elmSelector, url, headers) {
    return new ElementWithInnerHTML(
      new ParsedElmSelectors(elmSelector).value()[0],
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
      new ParsedElmSelectors(elmSelector).value()[0], values
    )
  }

  changeElmsClassName (newClassName, ...elmSelectors) {
    return new ElementsWithChangedClass(newClassName, ...new ParsedElmSelectors(...elmSelectors).value())
  }
}

module.exports = Actions
