'use strict'

class HTMLTunedElement extends HTMLElement {
  constructor () {
    super()
    this.rendered = false
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
