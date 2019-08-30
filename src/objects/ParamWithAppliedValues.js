'use strict'

class ParamWithAppliedValues {
  constructor (param, values) {
    this.param = param
    this.values = values
    this.paramRegExp = /\$\{([^{}]+|\S*)\}/g
  }

  value () {
    return this.param.replace(this.paramRegExp, (match, p1, offset, string) => {
      try {
        // eslint-disable-next-line no-eval
        return eval(`this.values.${p1}`)
      } catch (e) {
        return match
      }
    })
  }
}

module.exports = ParamWithAppliedValues
