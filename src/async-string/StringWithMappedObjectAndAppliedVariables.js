'use strict'

const { AsyncObject } = require('./../cutie/exports')
const { StringWithMappedObjectAndAppliedVariables } = require('./../string/exports')

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
