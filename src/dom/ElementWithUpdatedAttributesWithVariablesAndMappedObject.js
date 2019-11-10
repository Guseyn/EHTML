'use strict'

const { StringWithMappedObjectAndAppliedVariables } = require('./../string/exports')

const attributesForNotApplying = [
  'data-list-to-iterate',
  'data-condition-to-display'
]

class ElementWithUpdatedAttributesWithVariablesAndMappedObject {
  constructor (element, obj, objName) {
    this.element = element
    this.obj = obj
    this.objName = objName
  }

  value () {
    if (this.element.getAttribute) {
      for (let i = 0; i < this.element.attributes.length; i++) {
        const attrName = this.element.attributes[i].name
        const attrValue = this.element.attributes[i].value
        if (this.isForApplying(this.element, attrName)) {
          this.element.setAttribute(
            attrName,
            new StringWithMappedObjectAndAppliedVariables(
              attrValue, this.obj, this.objName
            ).value()
          )
          this.handleDataTextAndValueAttributes(this.element, attrName)
        } else {
          this.handleDataTextAndValueAttributes(this.element, attrName)
        }
      }
    }
    return this.element
  }

  handleDataTextAndValueAttributes (element, attrName) {
    if (attrName === 'data-text') {
      this.handleDataTextAttribute(this.element)
    } else if (attrName === 'data-value') {
      this.handleDataValueAttribute(this.element)
    }
  }

  handleDataTextAttribute (element) {
    if (!this.hasParamsInAttributeToApply(element, 'data-text')) {
      this.insertTextIntoElm(element, element.getAttribute('data-text'))
      element.removeAttribute('data-text')
    }
  }

  handleDataValueAttribute (element) {
    if (!this.hasParamsInAttributeToApply(element, 'data-value')) {
      element.value = element.getAttribute('data-value')
      element.removeAttribute('data-value')
    }
  }

  insertTextIntoElm (element, text) {
    const textNode = document.createTextNode(text)
    if (element.childNodes.length === 0) {
      element.appendChild(textNode)
    } else {
      element.insertBefore(textNode, element.childNodes[0])
    }
  }

  hasParamsInAttributeToApply (element, attrName) {
    return /\$\{([^${}]+)\}/g.test(
      element.getAttribute(attrName)
    )
  }

  isForApplying (element, attrName) {
    return attributesForNotApplying.indexOf(attrName) === -1 &&
      this.hasParamsInAttributeToApply(element, attrName)
  }
}

module.exports = ElementWithUpdatedAttributesWithVariablesAndMappedObject
