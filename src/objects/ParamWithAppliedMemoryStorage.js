'use strict'

class ParamWithAppliedMemoryStorage {
  constructor (param) {
    this.param = param
  }

  value () {
    return this.param.replace(/\$\{memoryStorage\.(.+)\}/g, (match, p1, offset, string) => {
      // eslint-disable-next-line no-undef
      return memoryStorage.getItem(p1)
    })
  }
}

module.exports = ParamWithAppliedMemoryStorage
