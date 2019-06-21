const { AsyncObject } = require('@page-libs/cutie')

class ElementWithAppliedValuesInTextNodes extends AsyncObject {
  constructor (element, values) {
    super(element, values)
  }

  syncCall () {
    return (element, values) => {
      return this.applyValuesToChildren(element, values)
    }
  }

  applyValuesToChildren (element, values) {
    element.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        child.nodeValue = child.nodeValue.replace(/\$\{(.+)\.(.+)\}/g, (match, p1, p2, offset, string) => {
          return values[p1][p2]
        })
      } else {
        this.applyValuesToChildren(child, values)
      }
    })
    return element
  }
}

module.exports = ElementWithAppliedValuesInTextNodes
