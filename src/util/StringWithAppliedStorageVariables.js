'use strict'

class StringWithAppliedStorageVariables {
  constructor (str) {
    this.str = str
  }

  value () {
    return this.str
      .replace(/\${((\s)?([^{}$]+\s)?(localStorage)(\.[^\s{}$]+)?(\s)?(\s[^{}$]+)?)}/g, (match, p1) => {
        // eslint-disable-next-line no-undef
        const expression = p1.replace(/localStorage(\.[^{}$\s]+)?/g, (match, p1) => {
          return `'${localStorage.getItem(p1.split('.')[1])}'`
        })
        // eslint-disable-next-line no-eval
        return eval(expression)
      })
      .replace(/\${((\s)?([^{}$]+\s)?(sessionStorage)(\.[^\s{}$]+)?(\s)?(\s[^{}$]+)?)}/g, (match, p1) => {
        // eslint-disable-next-line no-undef
        const expression = p1.replace(/sessionStorage(\.[^{}$\s]+)?/g, (match, p1) => {
          return `'${sessionStorage.getItem(p1.split('.')[1])}'`
        })
        // eslint-disable-next-line no-eval
        return eval(expression)
      })
  }
}

module.exports = StringWithAppliedStorageVariables
