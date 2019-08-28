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
          new Elements(child).applyStorageVariablesInAttributes('data-text', 'data-value')
          if (child.getAttribute('data-text')) {
            this.updateAttribute(child, 'data-text', values)
            if (this.readyToBeApplied(child, 'data-text')) {
              this.insertTextIntoElm(child, child.getAttribute('data-text'))
              child.removeAttribute('data-text')
            }
          } else if (child.getAttribute('data-value')) {
            this.updateAttribute(child, 'data-value', values)
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

  updateAttribute (element, attrName, values) {
    element.setAttribute(attrName, element.getAttribute(attrName).replace(paramRegExp, (match, p1, offset, string) => {
      try {
        // eslint-disable-next-line no-eval
        return eval(`values.${p1}`)
      } catch (e) {
        return match
      }
    }))
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
