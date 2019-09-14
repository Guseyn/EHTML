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
      .replace(/\$\{memoryStorage\.(.+)\}/g, (match, p1, offset, string) => {
        // eslint-disable-next-line no-undef
        return memoryStorage.getItem(p1)
      })
  }
}

module.exports = StringWithAppliedStorageVariables
