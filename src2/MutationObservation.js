'use strict'

const HTMLTemplate = require('./templates/HTMLTemplate')

const TEMPLATES = {
  'html': HTMLTemplate
}

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
            this.activateAllTemplatesInNode(node)
          }
        }
      }
    })
    observer.observe(this.targetNode, { attributes: true, childList: true, subtree: true })
  }

  activateAllTemplatesInNode (node) {
    if (this.isTemplate(node)) {
      const nodeName = node.getAttribute('name')
      if (nodeName && TEMPLATES[nodeName] && !node.activated) {
        new TEMPLATES[nodeName](node).activate()
        node.activated = true
      }
    }
    const childNodes = node.childNodes
    for (let i = 0; i < childNodes.length; i++) {
      this.activateAllTemplatesInNode(childNodes[i])
    }
  }

  isTemplate (node) {
    return node.nodeName.toLowerCase() === 'template'
  }
}

new MutationObservation().run()
