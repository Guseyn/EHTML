'use strict'

class EAttribute {
  constructor (elm, name, value) {
    this.elm = elm
    this.name = name
    this.value = value
  }

  is (name) {
    return this.name === name
  }

  applyStorageVariables () {
    this.applyLocalStorageVariables()
    this.applyMemoryStorageVariables()
  }

  applyLocalStorageVariables () {
    this.elm.setAttribute(
      this.name,
      this.value.replace(/\$\{localStorage\.(.+)\}/g,
        (match, p1, offset, string) => {
          return localStorage.getItem(p1)
        }
      )
    )
  }

  applyMemoryStorageVariables () {
    this.elm.setAttribute(
      this.name,
      this.value.replace(/\$\{memoryStorage\.(.+)\}/g,
        (match, p1, offset, string) => {
          // eslint-disable-next-line no-undef
          return memoryStorage.getItem(p1)
        }
      )
    )
  }
}

module.exports = EAttribute
