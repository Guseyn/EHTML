'use strict'

class HTMLTunedElement extends HTMLElement {
  constructor () {
    super()
    this.rendered = false
  }

  replaceWith (elm) {
    const instance = this
    instance.getAttributeNames().forEach(name => {
      elm.setAttribute(name, instance.getAttribute(name))
    })
    while (instance.firstChild) {
      const child = instance.removeChild(instance.firstChild)
      elm.appendChild(child)
    }
    instance.parentNode.replaceChild(elm, instance)
  }

  connectedCallback () {
    const instance = this
    const childrenConnectedCallback = () => {
      if (!instance.rendered) {
        instance.render()
        instance.rendered = true
      }
    }
    const observer = new MutationObserver(childrenConnectedCallback)
    const config = { attributes: false, childList: true, subtree: true }
    observer.observe(instance, config)
    setTimeout(() => {
      observer.disconnect()
    })
  }
}

module.exports = HTMLTunedElement
