'use strict'

const E = require('./E')

class E_FORM_DYNAMIC_VALUE extends E {
  constructor (node) {
    super(node)
  }

  activate () {
    this.node.style.display = 'none'
    this.node.name = this.node.getAttribute('name')
    this.node.value = () => {
      return this.appliedExpressionsInString(
        this.node.getAttribute('data-bound-to')
      )
    }
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

module.exports = E_FORM_DYNAMIC_VALUE
