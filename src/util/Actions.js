'use strict'

const ParsedActions = require('./ParsedActions')
const EmptyAsyncObject = require('./../async/EmptyAsyncObject')
const BuiltAsyncTreeByParsedActions = require('./BuiltAsyncTreeByParsedActions')

class Actions {
  constructor (tagName, actions) {
    this.tagName = tagName
    this.actions = actions
  }

  asAsyncTree (obj) {
    if (this.actions) {
      return new BuiltAsyncTreeByParsedActions(
        new ParsedActions(
          this.actions,
          this.tagName,
          obj
        ).value()
      ).value()
    }
    return new EmptyAsyncObject()
  }
}

module.exports = Actions
