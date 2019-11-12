'use strict'

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
              this.processNodeWithItsChildNodes(node)
            }
          }
        }
      }
    )
    observer.observe(this.targetNode, { childList: true, subtree: true })
  }

  processNodeWithItsChildNodes (node) {
    if (!node.observedByEHTML) {
      node.observedByEHTML = true
      const nodeName = this.nodeName(node)
      this.processAttributesOfNode(node)
      if (ELEMENTS[nodeName]) {
        if (!node.activatedByEHTML) {
          node.activatedByEHTML = true
          new ELEMENTS[nodeName](node).activate()
        }
      }
      const childNodes = node.childNodes
      for (let i = 0; i < childNodes.length; i++) {
        this.processNodeWithItsChildNodes(childNodes[i])
      }
    }
  }

  processAttributesOfNode (node) {
    if (node.attributes) {
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i]
        if (this.isForProcessing(attr)) {
          node.setAttribute(
            attr.name,
            attr.value.replace(/\$\{([^${}]+)\}/g, (match, p1) => {
              // eslint-disable-next-line no-eval
              const appliedExpression = eval(p1)
              if (typeof appliedExpression === 'object') {
                return JSON.stringify(appliedExpression)
              }
              return appliedExpression
            })
          )
          if (attr.name === 'data-text') {
            const textNode = document.createTextNode(
              attr.value
            )
            if (node.childNodes.length === 0) {
              node.appendChild(textNode)
            } else {
              node.insertBefore(textNode, node.childNodes[0])
            }
            node.removeAttribute('data-text')
          } else if (attr.name === 'data-value') {
            node.value = attr.value
            node.removeAttribute('data-value')
          }
        }
      }
    }
  }

  isForProcessing (attr) {
    return [
      'data-actions-on-response',
      'data-list-to-iterate',
      'data-item-name'
    ].indexOf(attr.name) === -1 &&
      /\$\{([^${}]+)\}/g.test(attr.value)
  }

  nodeName (node) {
    return this.isEPageWithUrl(node) ? 'e-page-with-url' : node.nodeName.toLowerCase()
  }

  isEPageWithUrl (node) {
    if (node.nodeName.toLowerCase() === 'e-page-with-url') {
      throw new Error('e-page-with-url must be <template>')
    }
    if (this.isTemplate(node)) {
      const templateType = node.getAttribute('is')
      if (templateType) {
        return templateType === 'e-page-with-url'
      }
      return false
    }
    return false
  }

  isTemplate (node) {
    return node.nodeName.toLowerCase() === 'template'
  }
}

new MutationObservation().run()
