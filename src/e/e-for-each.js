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

    apply (list) {
      const appliedInnerHTML = new StringBuffer()
      list.forEach(item => {
        appliedInnerHTML.append(
          new ElementWithMappedObject(
            this.cloneNode(true),
            item,
            'data-item-name'
          ).value().innerHTML
        )
      })
      const template = document.createElement('template')
      template.innerHTML = appliedInnerHTML.toString()
      this.parentNode.replaceChild(
        document.importNode(template.content, true), this
      )
    }
  }
)
