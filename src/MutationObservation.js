'use strict'

const ELEMENTS = require('./E/exports')

class MutationObservation {
  constructor () {
    this.targetNode = document
  }

  run () {
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i]
            this.activateNodeWithItsChildNodes(node)
          }
        }
      }
    })
    observer.observe(this.targetNode, { attributes: true, childList: true, subtree: true })
  }

  activateNodeWithItsChildNodes (node) {
    const nodeName = node.nodeName.toLowerCase()
    if (ELEMENTS[nodeName] && !node.activated) {
      node.activated = true
      new ELEMENTS[nodeName](node)
        .applyVariablesToAttributes()
        .activate()
    }
    const childNodes = node.childNodes
    for (let i = 0; i < childNodes.length; i++) {
      this.activateNodeWithItsChildNodes(childNodes[i])
    }
  }
}

new MutationObservation().run()
