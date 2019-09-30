'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const StringWithMappedObject = require('./../util/StringWithMappedObject')

class ElementWithMappedObject extends AsyncObject {
  constructor (element, obj, objName) {
    super(element, obj, objName)
  }

  syncCall () {
    return (element, obj, objName) => {
      if (element) {
        const objName = element.getAttribute('data-response-object-name')
        if (!objName) {
          throw new Error(`elm #${element.getAttribute('id')} must have attribute data-response-object-name for applying values to child nodes, so you can know what object it encapsulates`)
        }
        const OBJ = { }
        OBJ[objName] = obj
        return this.mapObjToChildren(element, OBJ, objName)
      }
      throw new Error(`element is ${element} in mapObjToElm`)
    }
  }

  mapObjToChildren (element, obj, objName) {
    element.childNodes.forEach(child => {
      if (child.getAttribute) {
        for (let i = 0; i < child.attributes.length; i++) {
          const attrName = child.attributes[i].name
          const attrValue = child.attributes[i].value
          if (attrName !== 'data-actions-on-response') {
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
        this.mapObjToChildren(child, obj, objName)
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
