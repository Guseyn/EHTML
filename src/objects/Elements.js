'use strict'

class Elements {
  constructor (...elements) {
    this.elements = elements
  }

  applyStorageVariablesInAttributes (...attrNames) {
    this.elements.forEach(element => {
      attrNames.forEach(attrName => {
        const attr = element.getAttribute(attrName)
        if (attr) {
          element.setAttribute(
            attrName,
            this.attributeWithAppliedLocalStorageVariables(
              this.attributeWithAppliedMemoryStorageVariables(
                attr
              )
            )
          )
        }
      })
    })
  }

  attributeWithAppliedLocalStorageVariables (attribute) {
    return attribute.replace(/\$\{localStorage\.(.+)\}/g, (match, p1, offset, string) => {
      return localStorage.getItem(p1)
    })
  }

  attributeWithAppliedMemoryStorageVariables (attribute) {
    return attribute.replace(/\$\{memoryStorage\.(.+)\}/g, (match, p1, offset, string) => {
      // eslint-disable-next-line no-undef
      return memoryStorage.getItem(p1)
    })
  }
}

module.exports = Elements
