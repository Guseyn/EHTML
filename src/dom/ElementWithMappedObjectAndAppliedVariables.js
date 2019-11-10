'use strict'

const { StringWithMappedObjectAndAppliedVariables } = require('./../string/exports')
const ElementWithUpdatedAttributesWithVariablesAndMappedObject = require('./ElementWithUpdatedAttributesWithVariablesAndMappedObject')
const DocumentFragmentWithAttributes = require('./DocumentFragmentWithAttributes')

class ElementWithMappedObjectAndAppliedVariables {
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
      this.mapObjToChildren(
        new ElementWithUpdatedAttributesWithVariablesAndMappedObject(
          child, obj, objName
        ).value(),
        obj,
        objName
      )
      if (this.isEForEach(child)) {
        this.activateEForEach(child, obj, objName, this.objNameAttribute)
      } else if (this.isEIf(child)) {
        this.activateEIf(child, obj, objName, this.objNameAttribute)
      }
    })
  }

  isEForEach (element) {
    return element.nodeName.toLowerCase() === 'template' &&
      element.getAttribute('is').toLowerCase() === 'e-for-each'
  }

  isEIf (element) {
    return element.nodeName.toLowerCase() === 'template' &&
      element.getAttribute('is').toLowerCase() === 'e-if'
  }

  activateEForEach (element, obj, objName, objNameAttribute) {
    const list = JSON.parse(
      new StringWithMappedObjectAndAppliedVariables(
        element.getAttribute('data-list-to-iterate'), obj, objName
      ).value()
    )
    const fragment = new DocumentFragmentWithAttributes(
      document.createDocumentFragment(),
      [{
        name: objNameAttribute,
        value: objName
      }]
    )
    list.forEach((item, index) => {
      item.index = index + 1
      const itemFragment = new DocumentFragmentWithAttributes(
        element.content.cloneNode(true),
        this.itemFragmentAttributesForEForEach(
          element, objNameAttribute, objName
        )
      )
      fragment.appendChild(
        new ElementWithMappedObjectAndAppliedVariables(
          itemFragment, item, 'data-item-name'
        ).value()
      )
    })
    element.parentNode.replaceChild(
      new ElementWithMappedObjectAndAppliedVariables(
        fragment, obj[objName], objNameAttribute
      ).value(),
      element
    )
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

  activateEIf (element, obj, objName, objNameAttribute) {
    const toDisplay = new StringWithMappedObjectAndAppliedVariables(
      element.getAttribute('data-condition-to-display'), obj, objName
    ).value()
    if (toDisplay === 'true') {
      const fragment = new DocumentFragmentWithAttributes(
        element.content.cloneNode(true),
        [{
          name: objNameAttribute,
          value: objName
        }]
      )
      element.parentNode.replaceChild(
        new ElementWithMappedObjectAndAppliedVariables(
          fragment, obj[objName], objNameAttribute
        ).value(),
        element
      )
    }
  }
}

module.exports = ElementWithMappedObjectAndAppliedVariables
