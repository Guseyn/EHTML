'use strict'

const E = require('./E')

class E_IF extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    const toDisplayExpression = this.node.getAttribute('data-condition-to-display')
    if (!toDisplayExpression) {
      throw new Error('e-if must have "data-condition-to-display" attribute')
    }
    const toDisplay = this.appliedExpressionsInString(toDisplayExpression)
    if (toDisplay === 'true') {
      const contentNode = document.importNode(this.node.content, true)
      this.node.parentNode.insertBefore(contentNode, this.node)
    }
    this.node.parentNode.removeChild(this.node)
  }

  appliedExpressionsInString (string) {
    return string.replace(/\$\{([^${}]+)\}/gm, (match, p1) => {
      // eslint-disable-next-line no-eval
      const appliedExpression = eval(p1)
      if (typeof appliedExpression === 'object') {
        return JSON.stringify(appliedExpression)
      }
      return appliedExpression
    })
  }
}

module.exports = E_IF
