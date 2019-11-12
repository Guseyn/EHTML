'use strict'

const { AsyncObject } = require('./../cutie/exports')
const { ElementWithMappedObject } = require('./../dom/exports')

class AsyncElementWithMappedObject extends AsyncObject {
  constructor (element, obj) {
    super(element, obj)
  }

  syncCall () {
    return (element, response) => {
      return new ElementWithMappedObject(element, response).value()
    }
  }
}

module.exports = AsyncElementWithMappedObject
