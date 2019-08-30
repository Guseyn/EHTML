'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const ParamWithAppliedValues = require('./../objects/ParamWithAppliedValues')
const ParamWithAppliedLocalStorage = require('./../objects/ParamWithAppliedLocalStorage')
const ParamWithAppliedMemoryStorage = require('./../objects/ParamWithAppliedMemoryStorage')

class ElementWithAppliedDataTextAndValueAttributesForChildNodes extends AsyncObject {
  constructor (element, values) {
    super(element, values)
  }

  syncCall () {
    return (element, values) => {
      return this.applyValuesToChildren(element, values)
    }
  }

  applyValuesToChildren (element, values) {
    element.childNodes.forEach(child => {
      if (child.getAttribute) {
        this.applyStorageVariablesInAttributes(child, 'data-text', 'data-value')
        if (child.getAttribute('data-text')) {
          this.applyValuesInAttribute(child, 'data-text', values)
          if (!this.hasParamsInAttributeToApply(child, 'data-text')) {
            this.insertTextIntoElm(child, child.getAttribute('data-text'))
            child.removeAttribute('data-text')
          }
        } else if (child.getAttribute('data-value')) {
          this.applyValuesInAttribute(child, 'data-value', values)
          if (!this.hasParamsInAttributeToApply(child, 'data-value')) {
            child.value = child.getAttribute('data-value')
            child.removeAttribute('data-value')
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
    return /\$\{([^{}]+|\S*)\}/g.test(element.getAttribute(attrName))
  }
}

module.exports = ElementWithAppliedDataTextAndValueAttributesForChildNodes
