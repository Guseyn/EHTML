'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ElementWithInnerHTML extends AsyncObject {
  constructor (elm, html) {
    super(elm, html)
  }

  syncCall () {
    return (elm, html) => {
      elm.innerHTML = html
      return elm
    }
  }
}

module.exports = ElementWithInnerHTML
