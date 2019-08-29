'use strict'

const paramRegExp = /\$\{([^{}]+|\S*)\}/g

class Element {
  constructor (element) {
    element.applyStorageVariablesInAttributes = (...attrNames) => {
      this.applyStorageVariablesInAttributes(element, ...attrNames)
    }
    element.applyValuesInAttributes = (attrName, values) => {
      this.applyValuesInAttributes(element, attrName, values)
    }
    element.hasParamsInAttributesToApply = (attrName) => {
      return this.hasParamsInAttributesToApply(element, attrName)
    }
    return element
  }

  applyStorageVariablesInAttributes (element, ...attrNames) {
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
  }

  applyValuesInAttributes (element, attrName, values) {
    const attr = element.getAttribute(attrName)
    element.setAttribute(attrName, attr.replace(paramRegExp, (match, p1, offset, string) => {
      try {
        // eslint-disable-next-line no-eval
        return eval(`values.${p1}`)
      } catch (e) {
        return match
      }
    }))
  }

  hasParamsInAttributesToApply (element, attrName) {
    return paramRegExp.test(element.getAttribute(attrName))
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

module.exports = Element
