'use strict'

const paramRegExp = /\$\{(\S*)\}/g

class Elements {
  constructor (...elements) {
    this.elements = elements
  }

  withAppliedStorageVariablesInAttributes (...attrNames) {
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
    return this
  }

  withAppliedObjectValuesInAttributes (values, ...attrNames) {
    this.elements.forEach(element => {
      attrNames.forEach(attrName => {
        element.setAttribute(attrName, (element.getAttribute(attrName)).replace(paramRegExp, (match, p1, offset, string) => {
          try {
            // eslint-disable-next-line no-eval
            return eval(`values.${p1}`)
          } catch (e) {
            return match
          }
        }))
      })
    })
    return this
  }

  value () {
    return this.elements
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
