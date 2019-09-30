'use strict'

const ParsedActions = require('./ParsedActions')
const EmptyAsyncObject = require('./../async/EmptyAsyncObject')
const BuiltAsyncTreeByParsedActions = require('./BuiltAsyncTreeByParsedActions')

class Actions {
  constructor (tagName, actions) {
    this.tagName = tagName
    this.actions = actions
  }

  asAsyncTree (obj, objName) {
    if (this.actions) {
      return new BuiltAsyncTreeByParsedActions(
        new ParsedActions(
          this.actions,
          this.tagName,
          obj,
          objName
        ).value()
      ).value()
    }
    return new EmptyAsyncObject()
  }
}

module.exports = Actions
