'use strict'

const { ElementWithMappedObjectAndAppliedVariables } = require('./dom/exports')
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
            if (!node.observedByEHTML) {
              node.observedByEHTML = true
              this.activateNodeWithItsChildNodes(
                this.mappedNodeWithVariablesIfItsBody(
                  node
                )
              )
            }
          }
        }
      }
    })
    observer.observe(this.targetNode, { childList: true, subtree: true })
  }

  activateNodeWithItsChildNodes (node) {
    const nodeName = this.nodeName(node)
    if (ELEMENTS[nodeName]) {
      if (!node.activatedByEHTML) {
        node.activatedByEHTML = true
        new ELEMENTS[nodeName](node).activate()
      }
    }
    const childNodes = node.childNodes
    for (let i = 0; i < childNodes.length; i++) {
      this.activateNodeWithItsChildNodes(childNodes[i])
    }
  }

  nodeName (node) {
    return this.isEPageWithUrl(node) ? 'e-page-with-url' : node.nodeName.toLowerCase()
  }

  mappedNodeWithVariablesIfItsBody (node) {
    if (this.isBody(node)) {
      return new ElementWithMappedObjectAndAppliedVariables(
        node
      ).value()
    }
    return node
  }

  isBody (node) {
    return node.nodeName.toLowerCase() === 'body'
  }

  isEPageWithUrl (node) {
    return node.nodeName.toLowerCase() === 'template' && node.getAttribute('is').toLowerCase() === 'e-page-with-url'
  }
}

new MutationObservation().run()
