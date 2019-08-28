'use strict'

const Elements = require('./../objects/Elements')

class HTMLTunedElement extends HTMLElement {
  constructor () {
    super()
    this.rendered = false
  }

  // PUBLIC

  attributesWithStorageVariables () {
    return []
  }

  replacedWith (elm) {
    const instance = this
    instance.getAttributeNames().forEach(name => {
      elm.setAttribute(name, instance.getAttribute(name))
    })
    while (instance.firstChild) {
      const child = instance.removeChild(instance.firstChild)
      elm.appendChild(child)
    }
    instance.parentNode.replaceChild(elm, instance)
    return elm
  }

  // PRIVATE

  connectedCallback () {
    const instance = this
    const attributesWithStorageVariables = this.attributesWithStorageVariables()
      .concat(this.defaultAttributesWithStorageVariables()).filter(attr => this.getAttribute(attr))
    new Elements(this).applyStorageVariablesInAttributes(...attributesWithStorageVariables)
    setTimeout(() => {
      if (!instance.rendered) {
        instance.render()
        instance.rendered = true
      }
    })
  }

  defaultAttributesWithStorageVariables () {
    return ['data-action']
  }
}

module.exports = HTMLTunedElement
