'use strict'

class ParamWithAppliedLocalStorage {
  constructor (param) {
    this.param = param
  }

  value () {
    return this.param.replace(/\$\{localStorage\.(.+)\}/g, (match, p1, offset, string) => {
      return localStorage.getItem(p1)
    })
  }
}

module.exports = ParamWithAppliedLocalStorage
