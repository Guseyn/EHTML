'use strict'

const DocumentFragmentWithAttributes = require('./../util/DocumentFragmentWithAttributes')
const StringWithMappedObjectAndAppliedVariables = require('./../util/StringWithMappedObjectAndAppliedVariables')
const ElementWithMappedObject = require('./../util/ElementWithMappedObject')

const E = require('./../E')

E(
  'e-for-each',
  class extends HTMLTemplateElement {
    constructor () {
      super()
    }

    onRender () {}

    activate (obj, objName, objNameAttribute) {
      const st = new StringWithMappedObjectAndAppliedVariables(
        this.getAttribute('data-list-to-iterate'), obj, objName
      ).value()
      console.log(st)
      const list = JSON.parse(
        st
      )
      const fragment = new DocumentFragmentWithAttributes()
      list.forEach((item, index) => {
        item.index = index
        const content = this.content.cloneNode(true)
        const itemFragmentAttributes = this.attributes
        itemFragmentAttributes[objNameAttribute] = objName
        const itemFragment = new DocumentFragmentWithAttributes(
          content, itemFragmentAttributes
        )
        fragment.appendChild(
          new ElementWithMappedObject(
            new ElementWithMappedObject(
              itemFragment, item, 'data-item-name'
            ).value(), obj, objNameAttribute
          ).value()
        )
      })
      this.parentNode.replaceChild(fragment, this)
    }
  },
  { extends: 'template' }
)
