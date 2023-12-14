'use strict'

module.exports = (obj) => {
  if (window.structuredClone) {
    return window.structuredClone(
      obj
    )
  }
  return JSON.parse(
    JSON.stringify(obj)
  )
}
