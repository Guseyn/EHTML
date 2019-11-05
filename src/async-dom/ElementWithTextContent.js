
'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ElementWithTextContent extends AsyncObject {
  constructor (elm, html) {
    super(elm, html)
  }

  syncCall () {
    return (elm, html) => {
      elm.textContent = html
      return elm
    }
  }
}

module.exports = ElementWithTextContent
