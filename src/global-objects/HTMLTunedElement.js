'use strict'

const Element = require('./../objects/Element')
const Actions = require('./../objects/Actions')

class HTMLTunedElement extends HTMLElement {
  constructor () {
    super()
    this.rendered = false
  }

  // PUBLIC

  attributesWithStorageVariables () {
    return []
  }

  supportedActions () {
    return [
      'redirect',
      'saveToLocalStorage',
      'saveToMemoryStorage',
      'innerHTML',
      'applyTextsAndValuesToChildNodes',
      'hideElms',
      'showElms',
      'disableElms',
      'enableElms',
      'changeElmsClassName'
    ]
  }

  actions (values) {
    return new Actions(
      this.tagName,
      this.getAttribute('data-actions'),
      this.supportedActions()
    ).asyncTree(values)
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
    const attributesWithStorageVariables = this
      .attributesWithStorageVariables()
      .concat(this.defaultAttributesWithStorageVariables())
      .filter(attr => this.getAttribute(attr))
    new Element(this).applyStorageVariablesInAttributes(...attributesWithStorageVariables)
    setTimeout(() => {
      if (!instance.rendered) {
        instance.render()
        instance.rendered = true
      }
    })
  }

  defaultAttributesWithStorageVariables () {
    return ['data-actions']
  }
}

module.exports = HTMLTunedElement
