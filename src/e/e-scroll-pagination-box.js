'use strict'

const E = require('./../E')
const DocumentFragmentWithAttributes = require('./../util/DocumentFragmentWithAttributes')

E(
  'e-scroll-pagination-box',
  class extends HTMLTemplateElement {
    constructor () {
      super()
    }

    onRender () {
      /* if (!this.getAttribute('name')) {
        throw new Error(`${this} must have name attribute`)
      } */
      const box = document.createElement('div')
      for (let i = 0; i < this.attributes.length; i++) {
        box.setAttribute(this.attributes[i].name, this.attributes[i].value)
      }
      const fragment = new DocumentFragmentWithAttributes(
        this.content.cloneNode(true)
      )
      box.appendChild(fragment)
      this.parentNode.replaceChild(box, this)
    }
  },
  { extends: 'template' }
)
