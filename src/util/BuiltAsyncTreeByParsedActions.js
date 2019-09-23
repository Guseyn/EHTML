'use strict'

const EmptyAsyncObject = require('./../async/EmptyAsyncObject')

class BuiltAsyncTreeByParsedActions {
  constructor (parsedActions) {
    this.parsedActions = parsedActions
  }

  value () {
    if (this.parsedActions.length === 0) {
      return new EmptyAsyncObject(this.values)
    }
    return this.buildAsyncTree()
  }

  buildAsyncTree (curIndex = 0) {
    if (this.parsedActions.length === curIndex) {
      return this.parsedActions[0]
    } else {
      this.getLastNext(
        this.parsedActions[curIndex]
      ).after(
        this.parsedActions[curIndex + 1]
      )
      return this.buildAsyncTree(curIndex + 1)
    }
  }

  getLastNext (parsedAction) {
    if (parsedAction.next) {
      return this.getLastNext(parsedAction.next)
    }
    return parsedAction
  }
}

module.exports = BuiltAsyncTreeByParsedActions
