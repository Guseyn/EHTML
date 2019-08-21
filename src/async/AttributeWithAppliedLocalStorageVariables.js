'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class AttributeWithAppliedLocalStorageVariables extends AsyncObject {
  constructor (attribute) {
    super(attribute)
  }

  syncCall () {
    return (attribute) => {
      attribute = attribute || ''
      return attribute.replace(/\$\{localStorage\.(.+)\}/g, (match, p1, offset, string) => {
        return localStorage.getItem(p1)
      })
    }
  }
}

module.exports = AttributeWithAppliedLocalStorageVariables
