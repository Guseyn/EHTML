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
              if (!node.observedByEHTML) {
                node.observedByEHTML = true
                this.activateNodeWithItsChildNodes(
                  this.nodeWithProcessedAttributes(node)
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

  nodeWithProcessedAttributes (node) {
    if (node.attributes) {
      const elmAttributes = Array.from(node.attributes)
      elmAttributes.forEach(attr => {
        if (this.isForProcessing(attr)) {
          node.setAttribute(
            attr.name,
            attr.value.replace(/\$\{([^${}]+)\}/g, (match, p1) => {
              try {
                // eslint-disable-next-line no-eval
                const appliedExpression = eval(p1)
                if (typeof appliedExpression === 'object') {
                  return JSON.stringify(appliedExpression)
                }
                return appliedExpression
              } catch (err) {
                console.log(attr)
                throw err
              }
            })
          )
        }
      })
    }
    return node
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
