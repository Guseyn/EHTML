'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const StringWithMappedObjectAndAppliedVariables = require('./../util/StringWithMappedObjectAndAppliedVariables')

class AsyncStringWithMappedObjectAndAppliedVariables extends AsyncObject {
  constructor (str, obj, objName) {
    super(str, obj, objName)
  }

  syncCall () {
    return (str, obj, objName) => {
      return new StringWithMappedObjectAndAppliedVariables(str, obj, objName).value()
    }
  }
}

module.exports = AsyncStringWithMappedObjectAndAppliedVariables
