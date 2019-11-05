'use strict'

const { AsyncObject } = require('./../cutie/exports')

// Represented result is buffer
class StringFromBuffer extends AsyncObject {
  constructor (buf, encoding, start, end) {
    super(buf, encoding || 'utf8', start || 0, end || buf.length)
  }

  syncCall () {
    return (buf, encoding, start, end) => {
      return buf.toString(encoding, start, end)
    }
  }
}

module.exports = StringFromBuffer
