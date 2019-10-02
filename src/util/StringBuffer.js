'use strict'

class StringBuffer {
  constructor () {
    this.strings = []
  }

  append (string) {
    this.strings.push(string)
  }

  toString () {
    return this.strings.join('')
  }
}

module.exports = StringBuffer
