
'use strict'

const { AsyncObject } = require('./../cutie/exports')

// remove parent without removing children
class UnwrappedChildrenOfParent extends AsyncObject {
  constructor (parent) {
    super(parent)
  }

  syncCall () {
    return (parent) => {
      const docFrag = document.createDocumentFragment()
      while (parent.firstChild) {
        const child = parent.removeChild(parent.firstChild)
        docFrag.appendChild(child)
      }
      parent.parentNode.replaceChild(docFrag, parent)
      return docFrag
    }
  }
}

module.exports = UnwrappedChildrenOfParent
