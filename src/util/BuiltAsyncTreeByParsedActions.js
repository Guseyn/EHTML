'use strict'

const EmptyAsyncObject = require('./../async/EmptyAsyncObject')

class BuiltAsyncTreeByParsedActions {
  constructor (parsedActions) {
    this.parsedActions = parsedActions
  }

  value () {
    const keys = Object.keys(this.parsedActions)
    const length = keys.length
    let index = 0
    if (length === 0) {
      return new EmptyAsyncObject()
    }
    return this.buildAsyncTree(index, length, keys)
  }

  buildAsyncTree (curIndex, length, keys) {
    if (length === curIndex) {
      return this.parsedActions[keys[0]]
    } else {
      this.getLastNext(
        this.parsedActions[keys[curIndex]]
      ).after(
        this.parsedActions[keys[curIndex + 1]]
      )
      return this.buildAsyncTree(curIndex + 1, length, keys)
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
