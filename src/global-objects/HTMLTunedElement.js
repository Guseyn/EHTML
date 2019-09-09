'use strict'

const { browserified } = require('@page-libs/cutie')
const { TheSameObjectWithValue } = browserified(require('@cuties/object'))
const ParamWithAppliedLocalStorage = require('./../objects/ParamWithAppliedLocalStorage')
const ParamWithAppliedMemoryStorage = require('./../objects/ParamWithAppliedMemoryStorage')
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
      'addHTML',
      'applyValuesToChildNodes',
      'hideElms',
      'showElms',
      'disableElms',
      'enableElms',
      'changeElmsClassName'
    ]
  }

  appliedActions (value) {
    const dataObj = {}
    return new TheSameObjectWithValue(
      dataObj, this.getAttribute('data-object') || 'OBJECT_NAME', value
    ).after(
      new Actions(
        this.tagName,
        this.getAttribute('data-actions'),
        this.supportedActions()
      ).asyncTree(dataObj)
    )
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
      .filter(attr => this.getAttribute(attr))
    // APPLY VARS: here we just apply storage vars to attrs of the elm
    this.applyStorageValuesToAttributes(attributesWithStorageVariables)
    setTimeout(() => {
      if (!instance.rendered) {
        instance.render()
        instance.rendered = true
      }
    })
  }

  applyStorageValuesToAttributes (attrs) {
    attrs.forEach(
      attr => {
        this.setAttribute(attr, new ParamWithAppliedLocalStorage(
          new ParamWithAppliedMemoryStorage(
            this.getAttribute(attr)
          ).value()
        ).value())
      }
    )
  }
}

module.exports = HTMLTunedElement
