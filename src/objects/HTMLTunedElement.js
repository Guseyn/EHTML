'use strict'

const RedirectAction = require('./../async/RedirectAction')
const LocalStorageWithSetValue = require('./../async/LocalStorageWithSetValue')
const MemoryStorageWithSetValue = require('./../async/MemoryStorageWithSetValue')
const HiddenElms = require('./../async/HiddenElms')
const ShownElms = require('./../async/ShownElms')
const DisabledElms = require('./../async/DisabledElms')
const EnabledElms = require('./../async/EnabledElms')

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

  // actions

  redirect (url) {
    return new RedirectAction(url)
  }

  saveToLocalStorage (key, value) {
    return new LocalStorageWithSetValue(key, value)
  }

  saveToMemoryStorage (key, value) {
    return new MemoryStorageWithSetValue(key, value)
  }

  hideElms (...elmIds) {
    return new HiddenElms(...elmIds)
  }

  showElms (...elmIds) {
    return new ShownElms(...elmIds)
  }

  disableElms (...elmIds) {
    return new DisabledElms(...elmIds)
  }

  enableElms (...elmIds) {
    return new EnabledElms(...elmIds)
  }

  // PRIVATE

  connectedCallback () {
    const instance = this
    const attributesWithStorageVariables = this.attributesWithStorageVariables().concat(
      this.defaultAttributesWithStorageVariables()
    )
    attributesWithStorageVariables.forEach(attr => {
      this.setAttribute(
        attr,
        this.attributeWithAppliedLocalStorageVariables(
          this.attributeWithAppliedMemoryStorageVariables(
            this.getAttribute(attr)
          )
        )
      )
    })
    setTimeout(() => {
      if (!instance.rendered) {
        instance.render()
        instance.rendered = true
      }
    })
  }

  defaultAttributesWithStorageVariables () {
    return ['data-action', 'data-action-params']
  }

  attributeWithAppliedLocalStorageVariables (attribute) {
    attribute = attribute || ''
    return attribute.replace(/\$\{localStorage\.(.+)\}/g, (match, p1, offset, string) => {
      return localStorage.getItem(p1)
    })
  }

  attributeWithAppliedMemoryStorageVariables (attribute) {
    attribute = attribute || ''
    return attribute.replace(/\$\{memoryStorage\.(.+)\}/g, (match, p1, offset, string) => {
      // eslint-disable-next-line no-undef
      return memoryStorage.getItem(p1)
    })
  }
}

module.exports = HTMLTunedElement
