
'use strict'

const { AsyncObject } = require('./../cutie/exports')

class ScrolledIntoView extends AsyncObject {
  constructor (element) {
    super(element)
  }

  syncCall () {
    return (element) => {
      element.scrollIntoView()
      return element
    }
  }
}

module.exports = ScrolledIntoView
