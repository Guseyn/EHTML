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
      if (new RegExp(/^#(\S+)$/g).test(elmSelector)) {
        elms.push(document.getElementById(elmSelector.split('#')[1]))
      } else if (new RegExp(/^\.(\S+)$/g).test(elmSelector)) {
        this.pushElms(elms, document.getElementsByClassName(elmSelector.split('.')[1]))
      } else if (new RegExp(/^(\S+)$/g).test(elmSelector)) {
        this.pushElms(elms, document.getElementsByTagName(elmSelector))
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
