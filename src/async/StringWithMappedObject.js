'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const StringWithMappedObject = require('./../util/StringWithMappedObject')

class AsyncStringWithMappedObject extends AsyncObject {
  constructor (str, obj, objName) {
    super(str, obj, objName)
  }

  syncCall () {
    return (str, obj, objName) => {
      return new StringWithMappedObject(str, obj, objName).value()
    }
  }
}

module.exports = AsyncStringWithMappedObject
