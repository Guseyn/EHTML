'use strict'

const EmptyAsyncObject = require('./../async/EmptyAsyncObject')

class BuiltAsyncTreeByParsedActions {
  constructor (parsedActions, values) {
    this.parsedActions = parsedActions
    this.values = values
  }

  value () {
    return this.buildAsyncTree()
  }

  buildAsyncTree (curIndex = 0) {
    if (this.parsedActions.length === 0) {
      return new EmptyAsyncObject(this.values)
    }
    if (this.parsedActions.length === curIndex) {
      return this.parsedActions[0]
    } else {
      this.parsedActions[curIndex].after(
        this.parsedActions[curIndex + 1]
      )
      return this.buildAsyncTree(curIndex + 1)
    }
  }
}

module.exports = BuiltAsyncTreeByParsedActions
