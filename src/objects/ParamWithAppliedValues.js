'use strict'

class ParamWithAppliedValues {
  constructor (param, values) {
    this.param = param
    this.values = values
  }

  value () {
    return this.param.replace(/\$\{([^{}]+|\S*)\}/g, (match, p1, offset, string) => {
      try {
        const res = this.valueOf(this.values, p1.split('.'))
        if (typeof res === 'object') {
          return JSON.stringify(res)
        }
        return res
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
