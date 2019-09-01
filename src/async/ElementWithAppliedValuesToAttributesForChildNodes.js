'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const ParamWithAppliedValues = require('./../objects/ParamWithAppliedValues')
const ParamWithAppliedLocalStorage = require('./../objects/ParamWithAppliedLocalStorage')
const ParamWithAppliedMemoryStorage = require('./../objects/ParamWithAppliedMemoryStorage')

class ElementWithAppliedValuesToAttributesForChildNodes extends AsyncObject {
  constructor (element, values) {
    super(element, values)
  }

  syncCall () {
    return (element, values) => {
      const dataObjectAttr = element.getAttribute('data-object')
      // APPLY VARS: here we just apply storage vars and values to attrs of the elm's child nodes
      return this.applyValuesToChildren(
        element,
        dataObjectAttr
          ? this.valuesWithNewKey(values, dataObjectAttr)
          : values
      )
    }
  }

  applyValuesToChildren (element, values) {
    element.childNodes.forEach(child => {
      if (child.getAttribute) {
        for (let i = 0; i < child.attributes.length; i++) {
          const attrName = child.attributes[i].name
          if (attrName !== 'data-actions') {
            this.applyStorageVariablesInAttributes(child, attrName)
            this.applyValuesInAttribute(child, attrName, values)
            if (attrName === 'data-text') {
              if (!this.hasParamsInAttributeToApply(child, 'data-text')) {
                this.insertTextIntoElm(child, child.getAttribute('data-text'))
                child.removeAttribute('data-text')
              }
            } else if (attrName === 'data-value') {
              if (!this.hasParamsInAttributeToApply(child, 'data-value')) {
                child.value = child.getAttribute('data-value')
                child.removeAttribute('data-value')
              }
            }
          }
        }
        this.applyValuesToChildren(child, values)
      }
    })
    return element
  }

  insertTextIntoElm (elm, text) {
    const textNode = document.createTextNode(text)
    if (elm.childNodes.length === 0) {
      elm.appendChild(textNode)
    } else {
      elm.insertBefore(textNode, elm.childNodes[0])
    }
  }

  applyStorageVariablesInAttributes (element, ...attrNames) {
    attrNames.forEach(attrName => {
      element.setAttribute(
        attrName,
        new ParamWithAppliedLocalStorage(
          new ParamWithAppliedMemoryStorage(
            element.getAttribute(attrName)
          ).value()
        ).value()
      )
    })
  }

  applyValuesInAttribute (element, attrName, values) {
    element.setAttribute(
      attrName,
      new ParamWithAppliedValues(
        element.getAttribute(attrName), values
      ).value()
    )
  }

  hasParamsInAttributeToApply (element, attrName) {
    return /\$\{([^{}]+|\S*)\}/g.test(element.getAttribute(attrName))
  }

  valuesWithNewKey (values, newKey) {
    const oldKey = Object.keys(values)[0]
    const newValues = {}
    newValues[newKey] = values[oldKey]
    return newValues
  }
}

module.exports = ElementWithAppliedValuesToAttributesForChildNodes
