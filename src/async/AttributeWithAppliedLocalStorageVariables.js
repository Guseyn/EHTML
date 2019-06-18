const { AsyncObject } = require('@page-libs/cutie')

class AttributeWithAppliedLocalStorageVariables extends AsyncObject {
  constructor (attribute) {
    super(attribute)
  }

  syncCall () {
    return (attribute) => {
      return attribute.replace(/\$\{localStorage\.(.+)\}/g, (match, p1, offset, string) => {
        return window.localStorage.getItem(p1)
      })
    }
  }
}

module.exports = AttributeWithAppliedLocalStorageVariables
