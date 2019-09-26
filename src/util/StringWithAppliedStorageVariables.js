'use strict'

class StringWithAppliedStorageVariables {
  constructor (str) {
    this.str = str
  }

  value () {
    return this.str
      .replace(/\$\{((localStorage\.([^\s]+))(.+)?)\}/g, (match, p1, p2, p3, p4, offset, string) => {
        // eslint-disable-next-line no-undef
        const expression = p1.replace(p2, `'${localStorage.getItem(p3)}'`)
        // eslint-disable-next-line no-eval
        return eval(expression)
      })
      .replace(/\$\{((sessionStorage\.([^\s]+))(.+)?)\}/g, (match, p1, p2, p3, p4, offset, string) => {
        // eslint-disable-next-line no-undef
        const expression = p1.replace(p2, `'${sessionStorage.getItem(p3)}'`)
        // eslint-disable-next-line no-eval
        return eval(expression)
      })
  }
}

module.exports = StringWithAppliedStorageVariables
