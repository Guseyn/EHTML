'use strict'

const { AsyncObject } = require('./../cutie/exports')
const { ElementWithMappedObjectAndAppliedVariables } = require('./../dom/exports')

class AsyncElementWithMappedObjectAndAppliedVariables extends AsyncObject {
  constructor (element, obj, objNameAttribute) {
    super(element, obj, objNameAttribute)
  }

  syncCall () {
    return (element, response, objNameAttribute) => {
      return new ElementWithMappedObjectAndAppliedVariables(element, response, objNameAttribute).value()
    }
  }
}

module.exports = AsyncElementWithMappedObjectAndAppliedVariables
