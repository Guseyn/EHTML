'use strict'

module.exports = (obj) => {
  return JSON.parse(
    JSON.stringify(obj)
  )
}
