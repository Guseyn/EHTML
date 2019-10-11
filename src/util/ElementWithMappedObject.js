'use strict'

const StringWithMappedObjectAndAppliedVariables = require('./../util/StringWithMappedObjectAndAppliedVariables')
const DocumentFragmentWithAttributes = require('./../util/DocumentFragmentWithAttributes')

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
        this.activateEForEach(child, obj, objName, this.objNameAttribute)
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

  isForApplying (attrName) {
    const attributesForNotApplying = [
      'data-actions-on-response',
      'data-list-to-iterate'
    ]
    return attributesForNotApplying.indexOf(attrName) === -1
  }

  isEForEach (element) {
    return element.nodeName.toLowerCase() === 'template' && element.getAttribute('is').toLowerCase() === 'e-for-each'
  }

  activateEForEach (element, obj, objName, objNameAttribute) {
    const list = JSON.parse(
      new StringWithMappedObjectAndAppliedVariables(
        element.getAttribute('data-list-to-iterate'), obj, objName
      ).value()
    )
    const fragment = new DocumentFragmentWithAttributes()
    list.forEach((item, index) => {
      item.index = index + 1
      const content = element.content.cloneNode(true)
      const itemFragmentAttributes = this.itemFragmentAttributesForEForEach(element, objNameAttribute, objName)
      const itemFragment = new DocumentFragmentWithAttributes(
        content, itemFragmentAttributes
      )
      fragment.appendChild(
        new ElementWithMappedObject(
          new ElementWithMappedObject(
            itemFragment, item, 'data-item-name'
          ).value(), obj[objName], objNameAttribute
        ).value()
      )
    })
    element.parentNode.replaceChild(fragment, element)
  }

  itemFragmentAttributesForEForEach (element, objNameAttribute, objName) {
    const attrs = []
    for (let i = 0; i < element.attributes.length; i++) {
      attrs.push({
        name: element.attributes[i].name,
        value: element.attributes[i].value
      })
    }
    attrs.push({
      name: objNameAttribute,
      value: objName
    })
    return attrs
  }
}

module.exports = ElementWithMappedObject
