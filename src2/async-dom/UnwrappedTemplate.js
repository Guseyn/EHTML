
'use strict'

const { AsyncObject } = require('./../cutie/exports')

class UnwrappedTemplate extends AsyncObject {
  constructor (template) {
    super(template)
  }

  syncCall () {
    return (template) => {
      const fragment = template.content.cloneNode(true)
      template.parentNode.replaceChild(fragment, template)
      return fragment
    }
  }
}

module.exports = UnwrappedTemplate
