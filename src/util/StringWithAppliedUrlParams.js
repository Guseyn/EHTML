'use strict'

class StringWithAppliedUrlParams {
  constructor (str) {
    this.str = str
  }

  value () {
    return this.str
      .replace(/\$\{((urlParams\.([^\s]+))(.+)?)\}/g, (match, p1, p2, p3, p4, offset, string) => {
        // eslint-disable-next-line no-undef
        const expression = p1.replace(p2, `'${urlParams[p3]}'`)
        // eslint-disable-next-line no-eval
        return eval(expression)
      })
  }
}

module.exports = StringWithAppliedUrlParams
