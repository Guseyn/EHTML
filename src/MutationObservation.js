'use strict'

const { StringWithMappedObjectAndAppliedVariables } = require('./string/exports')
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
                this.withMappedVariablesToAttributes(
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

  withMappedVariablesToAttributes (node) {
    if (node.getAttribute) {
      for (let i = 0; i < node.attributes.length; i++) {
        const attrName = node.attributes[i].name
        const attrValue = node.attributes[i].value
        if (this.isForApplying(node, attrName)) {
          node.setAttribute(
            attrName,
            new StringWithMappedObjectAndAppliedVariables(
              attrValue
            ).value()
          )
          if (attrName === 'data-text') {
            this.handleDataTextAttribute(node)
          } else if (attrName === 'data-value') {
            this.handleDataValueAttribute(node)
          }
        }
      }
    }
    return node
  }

  handleDataTextAttribute (node) {
    if (!this.hasParamsInAttributeToApply(node, 'data-text')) {
      this.insertTextIntoElm(node, node.getAttribute('data-text'))
      node.removeAttribute('data-text')
    }
  }

  handleDataValueAttribute (node) {
    if (!this.hasParamsInAttributeToApply(node, 'data-value')) {
      node.value = node.getAttribute('data-value')
      node.removeAttribute('data-value')
    }
  }

  insertTextIntoElm (node, text) {
    const textNode = document.createTextNode(text)
    if (node.childNodes.length === 0) {
      node.appendChild(textNode)
    } else {
      node.insertBefore(textNode, node.childNodes[0])
    }
  }

  hasParamsInAttributeToApply (node, attrName) {
    return /\$\{([^${}]+)\}/g.test(
      node.getAttribute(attrName)
    )
  }

  isForApplying (node, attrName) {
    const attributesForNotApplying = [
      'data-list-to-iterate',
      'data-condition-to-display'
    ]
    return attributesForNotApplying.indexOf(attrName) === -1 && this.hasParamsInAttributeToApply(node, attrName)
  }

  isBody (node) {
    return node.nodeName.toLowerCase() === 'body'
  }

  isEPageWithUrl (node) {
    return node.nodeName.toLowerCase() === 'template' && node.getAttribute('is').toLowerCase() === 'e-page-with-url'
  }
}

new MutationObservation().run()
