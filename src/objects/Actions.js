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
const EmptyAsyncObject = require('./../async/EmptyAsyncObject')
const paramRegExp = /\$\{([^{}]+|\S*)\}/g

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
      if (this.supportedActions.indexOf(command) === -1) {
        throw new Error(`command ${command} is not supported for the element ${this.tagName}`)
      }
      const commandName = command.split('(')[0].trim()
      const commandParams = command.replace(')', '')
        .split(`${commandName}(`)[0]
        .split(',')
        .map(param => command.trim())
      switch (commandName) {
        case 'redirect':
          parsedCommands.push(this.redirect(commandParams[0]))
          break
        case 'saveToLocalStorage':
          parsedCommands.push(
            this.saveToLocalStorage(
              commandParams[0],
              this.paramWithAppliedLocalStorage(
                this.paramWithAppliedMemoryStorage(
                  this.paramWithAppliedValues(commandParams[1], values)
                )
              )
            )
          )
          break
        case 'saveToMemoryStorage':
          parsedCommands.push(
            this.saveToMemoryStorage(
              commandParams[0],
              this.paramWithAppliedLocalStorage(
                this.paramWithAppliedMemoryStorage(
                  this.paramWithAppliedValues(commandParams[1], values)
                )
              )
            )
          )
          break
        case 'innerHTML':
          parsedCommands.push(
            this.innerHTML(
              commandParams[0],
              this.paramWithAppliedLocalStorage(
                this.paramWithAppliedMemoryStorage(
                  this.paramWithAppliedValues(commandParams[1], values)
                )
              ),
              this.paramWithAppliedLocalStorage(
                this.paramWithAppliedMemoryStorage(
                  this.paramWithAppliedValues(commandParams[2], values)
                )
              )
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
    return this.buildAsyncTree(parsedCommands)
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
    return new ElementsWithChangedClass(newClassName, ...this.parseElmSelectors(...elmSelectors))
  }

  // PRIVATE

  buildAsyncTree (parsedCommands, curIndex = 1, tree = parsedCommands[0]) {
    if (parsedCommands.length === 0) {
      return new EmptyAsyncObject()
    }
    const curCommand = parsedCommands[curIndex]
    if (parsedCommands.length === curIndex) {
      return tree
    } else {
      tree.after(curCommand)
      return this.buildAsyncTree(parsedCommands, curIndex + 1, tree)
    }
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

  paramWithAppliedValues (param, values) {
    return param.replace(paramRegExp, (match, p1, offset, string) => {
      try {
        // eslint-disable-next-line no-eval
        return eval(`values.${p1}`)
      } catch (e) {
        return match
      }
    })
  }

  paramWithAppliedLocalStorage (param) {
    return param.replace(/\$\{localStorage\.(.+)\}/g, (match, p1, offset, string) => {
      return localStorage.getItem(p1)
    })
  }

  paramWithAppliedMemoryStorage (param) {
    return param.replace(/\$\{memoryStorage\.(.+)\}/g, (match, p1, offset, string) => {
      // eslint-disable-next-line no-undef
      return memoryStorage.getItem(p1)
    })
  }
}

module.exports = Actions
