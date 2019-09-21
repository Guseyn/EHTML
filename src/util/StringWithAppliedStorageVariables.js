'use strict'

class StringWithAppliedStorageVariables {
  constructor (str) {
    this.str = str
  }

  value () {
    return this.str
      .replace(/\$\{localStorage\.(.+)\}/g, (match, p1, offset, string) => {
        return localStorage.getItem(p1)
      })
      .replace(/\$\{sessionStorage\.(.+)\}/g, (match, p1, offset, string) => {
        const value = sessionStorage.getItem(p1)
        if (value instanceof Object) {
          return JSON.stringify(value)
        }
        return value
      })
  }
}

module.exports = StringWithAppliedStorageVariables
