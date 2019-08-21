'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const paramRegExp = /\$\{(\S*)\.(\S*)\}/g

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
    element.childNodes.forEach((child, index) => {
      if (child.getAttribute) {
        if (child.getAttribute('data-text')) {
          this.updateAttribute(child, 'data-text', values)
          if (this.readyToBeApplied(element, child, 'data-text', index)) {
            const textNode = document.createTextNode(child.getAttribute('data-text'))
            if (child.childNodes.length === 0) {
              child.appendChild(textNode)
            } else {
              child.insertBefore(textNode, child.childNodes[0])
            }
            child.removeAttribute('data-text')
          }
        } else if (child.getAttribute('data-value')) {
          this.updateAttribute(child, 'data-value', values)
          if (this.readyToBeApplied(element, child, 'data-value', index)) {
            child.value = child.getAttribute('data-value')
            child.removeAttribute('data-value')
          }
        }
        this.applyValuesToChildren(child, values)
      }
    })
    return element
  }

  updateAttribute (element, attrName, values) {
    element.setAttribute(attrName, element.getAttribute(attrName).replace(paramRegExp, (match, p1, p2, offset, string) => {
      return values[p1] ? values[p1][p2] : `$\{${p1}.${p2}}`
    }))
  }

  readyToBeApplied (element, child, attrName, index) {
    return !paramRegExp.test(child.getAttribute(attrName)) || element.childNodes.length - 1 === index
  }
}

module.exports = ElementWithAppliedDataTextAndValueAttributesForChildNodes
