'use strict'

const EmptyAsyncObject = require('./../async/EmptyAsyncObject')

class BuiltAsyncTreeByParsedCommands {
  constructor (parsedCommands, values) {
    this.parsedCommands = parsedCommands
    this.values = values
  }

  value () {
    return this.buildAsyncTree()
  }

  buildAsyncTree (curIndex = 0) {
    if (this.parsedCommands.length === 0) {
      return new EmptyAsyncObject(this.values)
    }
    if (this.parsedCommands.length === curIndex) {
      return this.parsedCommands[0]
    } else {
      this.parsedCommands[curIndex].after(this.parsedCommands[curIndex + 1])
      return this.buildAsyncTree(curIndex + 1)
    }
  }
}

module.exports = BuiltAsyncTreeByParsedCommands
