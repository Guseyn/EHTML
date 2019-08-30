'use strict'

class ParamWithAppliedValues {
  constructor (param, values) {
    this.param = param
    this.values = values
  }

  value () {
    return this.param.replace(/\$\{([^{}]+|\S*)\}/g, (match, p1, offset, string) => {
      try {
        return this.valueOf(this.values, p1.split('.'))
      } catch (e) {
        return match
      }
    })
  }

  valueOf (values, pathParts, index = 0) {
    if (pathParts.length - 1 === index) {
      return values[pathParts[index]]
    } else {
      return this.valueOf(values[pathParts[index]], pathParts, index + 1)
    }
  }
}

module.exports = ParamWithAppliedValues
