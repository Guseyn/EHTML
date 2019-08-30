'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const ParamWithAppliedValues = require('./../objects/ParamWithAppliedValues')

class AsyncParamWithAppliedValues extends AsyncObject {
  constructor (param, values) {
    super(param, values)
  }

  syncCall () {
    return (param, values) => {
      return new ParamWithAppliedValues(param, values).value()
    }
  }
}

module.exports = AsyncParamWithAppliedValues
