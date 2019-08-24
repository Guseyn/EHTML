'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class AttributeWithAppliedMemoryStorageVariables extends AsyncObject {
  constructor (attribute) {
    super(attribute)
  }

  syncCall () {
    return (attribute) => {
      attribute = attribute || ''
      return attribute.replace(/\$\{memoryStorage\.(.+)\}/g, (match, p1, offset, string) => {
        // eslint-disable-next-line no-undef
        return memoryStorage.getItem(p1)
      })
    }
  }
}

module.exports = AttributeWithAppliedMemoryStorageVariables
