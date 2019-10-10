'use strict'

const StringWithMappedObjectAndAppliedVariables = require('./../util/StringWithMappedObjectAndAppliedVariables')

class ElementWithMappedObject {
  constructor (element, obj, objNameAttribute) {
    this.element = element
    this.obj = obj
    this.objNameAttribute = objNameAttribute
  }

  value () {
    if (this.obj) {
      const objName = this.element.getAttribute(this.objNameAttribute)
      if (!objName) {
        throw new Error(`element #${this.element.getAttribute('id')} must have attribute ${this.objNameAttribute} for applying values to child nodes, so you can know what object it encapsulates`)
      }
      const obj = { }
      obj[objName] = this.obj
      this.mapObjToChildren(this.element, obj, objName)
    } else {
      this.mapObjToChildren(this.element)
    }
    return this.element
  }

  mapObjToChildren (element, obj, objName) {
    element.childNodes.forEach(child => {
      if (child.getAttribute) {
        for (let i = 0; i < child.attributes.length; i++) {
          const attrName = child.attributes[i].name
          const attrValue = child.attributes[i].value
          this.mapObjToAttribute(
            child, attrName, attrValue, obj, objName
          )
        }
      }
      this.mapObjToChildren(child, obj, objName)
      if (this.isEForEach(child)) {
        child.activate(obj, this.objNameAttribute)
      }
    })
  }

  mapObjToAttribute (child, attrName, attrValue, obj, objName) {
    if (this.isForApplying(attrName)) {
      child.setAttribute(
        attrName,
        new StringWithMappedObjectAndAppliedVariables(
          child.getAttribute(attrName), obj, objName
        ).value()
      )
      if (attrName === 'data-text') {
        this.handleDataTextAttribute(child)
      } else if (attrName === 'data-value') {
        this.handleDataValueAttribute(child)
      }
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
    return /\$\{([^{}\s]+)\}/g.test(
      element.getAttribute(attrName)
    )
  }

  isEForEach (element) {
    return element.nodeName.toLowerCase() === 'template' && element.getAttribute('is').toLowerCase() === 'e-for-each'
  }

  isForApplying (attrName) {
    const attributesForNotApplying = [
      'data-actions-on-response',
      'data-list-to-iterate'
    ]
    return attributesForNotApplying.indexOf(attrName) === -1
  }
}

module.exports = ElementWithMappedObject
