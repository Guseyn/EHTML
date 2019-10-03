'use strict'

const ElementWithMappedObject = require('./../util/ElementWithMappedObject')
const StringBuffer = require('./../util/StringBuffer')

const E = require('./../E')

E(
  'e-for-each',
  class extends HTMLElement {
    constructor () {
      super()
    }

    onRender () {}

    applied (list) {
      const appliedInnerHTML = new StringBuffer()
      list.forEach((item, index) => {
        item.index = index + 1
        appliedInnerHTML.append(
          new ElementWithMappedObject(
            this.cloneNode(true),
            item,
            'data-item-name'
          ).value().innerHTML
        )
      })
      this.innerHTML = appliedInnerHTML.toString()
      return this
    }
  }
)
