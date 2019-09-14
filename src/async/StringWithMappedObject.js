'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const StringWithMappedObject = require('./../util/StringWithMappedObject')

class AsyncStringWithMappedObject extends AsyncObject {
  constructor (str, obj) {
    super(str, obj)
  }

  syncCall () {
    return (str, obj) => {
      return new StringWithMappedObject(str, obj).value()
    }
  }
}

module.exports = AsyncStringWithMappedObject
