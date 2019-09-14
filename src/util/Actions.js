'use strict'

const ParsedActions = require('./ParsedActions')
const BuiltAsyncTreeByParsedActions = require('./BuiltAsyncTreeByParsedActions')

class Actions {
  constructor (tagName, actions, supportedActions) {
    this.tagName = tagName
    this.actions = actions
    this.supportedActions = supportedActions
  }

  asAsyncTree (obj) {
    return new BuiltAsyncTreeByParsedActions(
      new ParsedActions(
        this.actions,
        this.supportedActions,
        this.tagName,
        obj
      ).value()
    ).value()
  }
}

module.exports = Actions
