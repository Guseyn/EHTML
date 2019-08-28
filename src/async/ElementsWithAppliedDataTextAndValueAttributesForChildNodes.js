'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const Elements = require('./../objects/Elements')
const paramRegExp = /\$\{(\S*)\}/g

class ElementsWithAppliedDataTextAndValueAttributesForChildNodes extends AsyncObject {
  constructor (values, ...elements) {
    super(values, ...elements)
  }

  syncCall () {
    return (values, ...elements) => {
      return this.applyValuesToChildren(values, ...elements)
    }
  }

  applyValuesToChildren (values, ...elements) {
    elements.forEach(element => {
      element.childNodes.forEach(child => {
        if (child.getAttribute) {
          child = new Elements(child)
            .withAppliedStorageVariablesInAttributes('data-text', 'data-value')
            .value()[0]
          if (child.getAttribute('data-text')) {
            child = new Elements(child)
              .withAppliedObjectValuesInAttributes(values, 'data-text')
              .value()[0]
            if (this.readyToBeApplied(child, 'data-text')) {
              this.insertTextIntoElm(child, child.getAttribute('data-text'))
              child.removeAttribute('data-text')
            }
          } else if (child.getAttribute('data-value')) {
            child = new Elements(child)
              .withAppliedObjectValuesInAttributes(values, 'data-value')
              .value()[0]
            if (this.readyToBeApplied(child, 'data-value')) {
              child.value = child.getAttribute('data-value')
              child.removeAttribute('data-value')
            }
          }
          this.applyValuesToChildren(values, child)
        }
      })
    })
    return elements
  }

  insertTextIntoElm (elm, text) {
    const textNode = document.createTextNode(text)
    if (elm.childNodes.length === 0) {
      elm.appendChild(textNode)
    } else {
      elm.insertBefore(textNode, elm.childNodes[0])
    }
  }

  readyToBeApplied (child, attrName) {
    return !paramRegExp.test(child.getAttribute(attrName))
  }
}

module.exports = ElementsWithAppliedDataTextAndValueAttributesForChildNodes
