'use strict'

class StringWithAppliedUrlParams {
  constructor (str) {
    this.str = str
  }

  value () {
    return this.str
      .replace(/\${((\s)?([^{}$]+\s)?(urlParams)(\.[^\s{}$]+)?(\s)?(\s[^{}$]+)?)}/g, (match, p1) => {
        const expression = p1.replace(/urlParams(\.[^{}$\s]+)?/g, (match, p1) => {
          // eslint-disable-next-line no-undef, no-eval
          return eval(`'urlParams${p1}'`)
        })
        // eslint-disable-next-line no-eval
        return eval(expression)
      })
  }
}

module.exports = StringWithAppliedUrlParams
