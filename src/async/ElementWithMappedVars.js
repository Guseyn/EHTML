'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const StringWithAppliedStorageVariables = require('./../util/StringWithAppliedStorageVariables')
const StringWithAppliedUrlParams = require('./../util/StringWithAppliedUrlParams')

class ElementWithMappedVars extends AsyncObject {
  constructor (element) {
    super(element)
  }

  syncCall () {
    return (element) => {
      return this.mapVarsToChildren(element)
    }
  }

  mapVarsToChildren (element) {
    element.childNodes.forEach(child => {
      if (child.getAttribute) {
        for (let i = 0; i < child.attributes.length; i++) {
          const attrName = child.attributes[i].name
          const attrValue = child.attributes[i].value
          if (attrName !== 'data-actions-on-response') {
            this.applyStorageVariablesInAttribute(child, attrName, attrValue)
            this.applyUrlParamsInAttribute(child, attrName, attrValue)
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
        this.mapVarsToChildren(child)
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

  applyStorageVariablesInAttribute (element, attrName, attrValue) {
    element.setAttribute(
      attrName,
      new StringWithAppliedStorageVariables(
        attrValue
      ).value()
    )
  }

  applyUrlParamsInAttribute (element, attrName, attrValue) {
    element.setAttribute(
      attrName,
      new StringWithAppliedUrlParams(
        attrValue
      ).value()
    )
  }

  hasParamsInAttributeToApply (element, attrName) {
    return /\$\{([^{}\s]+)\}/g.test(
      element.getAttribute(attrName)
    )
  }
}

module.exports = ElementWithMappedVars
