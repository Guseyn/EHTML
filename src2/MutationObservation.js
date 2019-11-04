'use strict'

const { StringWithMappedObjectAndAppliedVariables } = require('./string/exports')

const {
  EHTML,
  EJSON,
  EFORM,
  ELOCAL_STORAGE_VALUE,
  ESESSION_STORAGE_VALUE
} = require('./E/exports')

const ELEMENTS = {
  'e-html': EHTML,
  'e-json': EJSON,
  'e-form': EFORM,
  'e-local-storage-value': ELOCAL_STORAGE_VALUE,
  'e-session-storage-value': ESESSION_STORAGE_VALUE
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
      for (let i = 0; i < node.attributes.length; i++) {
        node.setAttribute(
          node.attributes[i].name,
          new StringWithMappedObjectAndAppliedVariables(
            node.attributes[i].value
          ).value()
        )
      }
      new ELEMENTS[nodeName](node).activate()
    }
    const childNodes = node.childNodes
    for (let i = 0; i < childNodes.length; i++) {
      this.activateNodeWithItsChildNodes(childNodes[i])
    }
  }
}

new MutationObservation().run()
