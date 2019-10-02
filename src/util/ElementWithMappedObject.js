'use strict'

const StringWithMappedObject = require('./StringWithMappedObject')

class ElementWithMappedObject {
  constructor (element, obj, objNameAttribute) {
    this.element = element
    this.obj = obj
    this.objNameAttribute = objNameAttribute
  }

  value () {
    if (this.element) {
      const objName = this.element.getAttribute(this.objNameAttribute)
      if (!objName) {
        throw new Error(`element #${this.element.getAttribute('id')} must have attribute ${this.objNameAttribute} for applying values to child nodes, so you can know what object it encapsulates`)
      }
      const OBJ = { }
      OBJ[objName] = this.obj
      return this.mapObjToChildren(this.element, OBJ, objName)
    }
    throw new Error(`element is ${this.element} in mapObjToElm`)
  }

  mapObjToChildren (element, obj, objName) {
    element.childNodes.forEach(child => {
      if (child.nodeName === 'E-FOR-EACH') {
        const list = JSON.parse(
          new StringWithMappedObject(
            child.getAttribute('data-list-to-iterate'),
            obj,
            objName
          ).value()
        )
        child.apply(list)
      }
      if (child.getAttribute) {
        for (let i = 0; i < child.attributes.length; i++) {
          const attrName = child.attributes[i].name
          const attrValue = child.attributes[i].value
          this.commonMappingObjToChildren(
            child, attrName, attrValue, obj, objName
          )
        }
      }
      // TODO: apply to applied e-for-each as well
      this.mapObjToChildren(child, obj, objName)
    })
    return element
  }

  commonMappingObjToChildren (child, attrName, attrValue, obj, objName) {
    if (attrName !== 'data-actions-on-response' && attrName !== 'data-list-to-iterate') {
      this.mapObjToAttribute(child, attrName, attrValue, obj, objName)
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

  insertTextIntoElm (element, text) {
    const textNode = document.createTextNode(text)
    if (element.childNodes.length === 0) {
      element.appendChild(textNode)
    } else {
      element.insertBefore(textNode, element.childNodes[0])
    }
  }

  mapObjToAttribute (element, attrName, attrValue, obj, objName) {
    element.setAttribute(
      attrName,
      new StringWithMappedObject(
        element.getAttribute(attrName), obj, objName
      ).value()
    )
  }

  hasParamsInAttributeToApply (element, attrName) {
    return /\$\{([^{}\s]+)\}/g.test(
      element.getAttribute(attrName)
    )
  }
}

module.exports = ElementWithMappedObject
