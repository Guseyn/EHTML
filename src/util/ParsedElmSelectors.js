'use strict'

class ParsedElmSelectors {
  constructor (...elmSelectors) {
    this.elmSelectors = elmSelectors
  }

  value () {
    return this.parseElmSelectors()
  }

  parseElmSelectors () {
    const elms = []
    this.elmSelectors.forEach(elmSelector => {
      if (elmSelector) {
        this.pushElms(elms, document.querySelectorAll(elmSelector))
      }
    })
    return elms
  }

  pushElms (elms, elmsToPush) {
    for (let i = 0; i < elmsToPush.length; i++) {
      elms.push(elmsToPush[i])
    }
  }
}

module.exports = ParsedElmSelectors
