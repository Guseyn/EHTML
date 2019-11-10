'use strict'

const { ElementWithUpdatedAttributesWithVariablesAndMappedObject } = require('./dom/exports')
const ELEMENTS = require('./E/exports')

class MutationObservation {
  constructor () {
    this.targetNode = document
  }

  run () {
    const observer = new MutationObserver(
      (mutationsList, observer) => {
        for (let mutation of mutationsList) {
          if (mutation.type === 'childList') {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
              const node = mutation.addedNodes[i]
              if (!node.observedByEHTML) {
                node.observedByEHTML = true
                this.activateNodeWithItsChildNodes(
                  new ElementWithUpdatedAttributesWithVariablesAndMappedObject(
                    node
                  ).value()
                )
              }
            }
          }
        }
      }
    )
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

  isForApplying (node, attrName) {
    const attributesForNotApplying = [
      'data-list-to-iterate',
      'data-condition-to-display'
    ]
    return attributesForNotApplying.indexOf(attrName) === -1
  }

  isEPageWithUrl (node) {
    if (node.nodeName.toLowerCase() === 'e-page-with-url') {
      throw new Error('e-page-with-url must be <template>')
    }
    return node.nodeName.toLowerCase() === 'template' &&
      node.getAttribute('is').toLowerCase() === 'e-page-with-url'
  }
}

new MutationObservation().run()
