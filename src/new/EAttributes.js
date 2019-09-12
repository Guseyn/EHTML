'use strict'

const EAttribute = require('./EAttribute')

class EAttributes {
  constructor (elm) {
    this.elm = elm
    this.attrs = this.attributesAsArray()
  }

  value (name) {
    return this.elm.getAttribute(name)
  }

  each (attrFunc) {
    this.attrs.forEach(attrFunc)
  }

  attributesAsArray () {
    const attrs = []
    for (let i = 0; i < this.elm.attributes.length; i++) {
      attrs.push(
        new EAttribute(
          this.elm,
          this.elm.attributes[i].name,
          this.elm.attributes[i].value
        )
      )
    }
    return attrs
  }
}

module.exports = EAttributes
