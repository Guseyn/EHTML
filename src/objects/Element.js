'use strict'

const ParamWithAppliedValues = require('./../objects/ParamWithAppliedValues')
const ParamWithAppliedLocalStorage = require('./../objects/ParamWithAppliedLocalStorage')
const ParamWithAppliedMemoryStorage = require('./../objects/ParamWithAppliedMemoryStorage')
const paramRegExp = /\$\{([^{}]+|\S*)\}/g

class Element {
  constructor (element) {
    element.applyStorageVariablesInAttributes = (...attrNames) => {
      this.applyStorageVariablesInAttributes(element, ...attrNames)
    }
    element.applyValuesInAttribute = (attrName, values) => {
      this.applyValuesInAttribute(element, attrName, values)
    }
    element.hasParamsInAttributeToApply = (attrName) => {
      return this.hasParamsInAttributeToApply(element, attrName)
    }
    return element
  }

  applyStorageVariablesInAttributes (element, ...attrNames) {
    attrNames.forEach(attrName => {
      const attr = element.getAttribute(attrName)
      if (attr) {
        element.setAttribute(
          attrName,
          new ParamWithAppliedLocalStorage(
            new ParamWithAppliedMemoryStorage(
              attr
            ).value()
          ).value()
        )
      }
    })
  }

  applyValuesInAttribute (element, attrName, values) {
    const attr = element.getAttribute(attrName)
    element.setAttribute(attrName, new ParamWithAppliedValues(attr, values).value())
  }

  hasParamsInAttributeToApply (element, attrName) {
    return paramRegExp.test(element.getAttribute(attrName))
  }
}

module.exports = Element
