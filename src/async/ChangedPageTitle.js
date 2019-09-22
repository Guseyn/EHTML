'use strict'

const { AsyncObject } = require('@page-libs/cutie')

class ChangedPageTitle extends AsyncObject {
  constructor (doc, title) {
    super(doc, title)
  }

  syncCall () {
    return (doc, title) => {
      doc.title = title
      return title
    }
  }
}

module.exports = ChangedPageTitle
