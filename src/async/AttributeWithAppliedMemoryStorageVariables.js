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
        const keyParts = p1.split('.')
        const key = keyParts[0]
        const pathOfValue = keyParts.splice(1).join('.')
        if (pathOfValue.length === 0) {
          // eslint-disable-next-line no-undef
          return memoryStorage.getItem(p1)
        }
        // eslint-disable-next-line no-eval
        return eval(`memoryStorage.getItem('${key}').${pathOfValue}`)
      })
    }
  }
}

module.exports = AttributeWithAppliedMemoryStorageVariables
