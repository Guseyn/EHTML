'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const ElementWithMappedObject = require('./../util/ElementWithMappedObject')

class AsyncElementWithMappedObject extends AsyncObject {
  constructor (element, obj, objNameAttribute) {
    super(element, obj, objNameAttribute)
  }

  syncCall () {
    return (element, obj, objNameAttribute) => {
      return new ElementWithMappedObject(element, obj, objNameAttribute).value()
    }
  }
}

module.exports = AsyncElementWithMappedObject
