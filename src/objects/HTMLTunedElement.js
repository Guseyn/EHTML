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

  parseElmSelectors (...elmSelectors) {
    const elms = []
    elmSelectors.forEach(elmSelector => {
      if (new RegExp(/^#(\S+)$/g).test(elmSelector)) {
        elms.push(document.getElementById(elmSelector.split('#')[1]))
      } else if (new RegExp(/^\.(\S+)$/g).test(elmSelector)) {
        this.pushElms(elms, document.getElementsByClassName(elmSelector.split('.')[1]))
      } else if (new RegExp(/^(\S+)$/g).test(elmSelector)) {
        this.pushElms(elms, document.getElementsByTagName(elmSelector))
      }
    })
    return elms
  }

  // PRIVATE

  connectedCallback () {
    const instance = this
    const attributesWithStorageVariables = this.attributesWithStorageVariables()
      .concat(this.defaultAttributesWithStorageVariables()).filter(attr => this.getAttribute(attr))
    new Elements(this).withAppliedStorageVariablesInAttributes(...attributesWithStorageVariables)
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

  pushElms (elms, elmsToPush) {
    for (let i = 0; i < elmsToPush.length; i++) {
      elms.push(elmsToPush[i])
    }
  }
}

module.exports = HTMLTunedElement
