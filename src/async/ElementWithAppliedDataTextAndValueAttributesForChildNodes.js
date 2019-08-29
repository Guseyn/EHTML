'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const Element = require('./../objects/Element')

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
      child = new Element(child)
      if (child.getAttribute) {
        child.applyStorageVariablesInAttributes('data-text', 'data-value')
        if (child.getAttribute('data-text')) {
          child.applyValuesInAttributes('data-text', values)
          if (!child.hasParamsInAttributesToApply('data-text')) {
            this.insertTextIntoElm(child, child.getAttribute('data-text'))
            child.removeAttribute('data-text')
          }
        } else if (child.getAttribute('data-value')) {
          child.applyValuesInAttributes('data-value', values)
          if (!child.hasParamsInAttributesToApply('data-value')) {
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
}

module.exports = ElementWithAppliedDataTextAndValueAttributesForChildNodes
