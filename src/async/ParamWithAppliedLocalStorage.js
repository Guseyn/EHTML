'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const ParamWithAppliedLocalStorage = require('./../objects/ParamWithAppliedLocalStorage')

class AsyncParamWithAppliedLocalStorage extends AsyncObject {
  constructor (param) {
    super(param)
  }

  syncCall () {
    return (param) => {
      return new ParamWithAppliedLocalStorage(param).value()
    }
  }
}

module.exports = AsyncParamWithAppliedLocalStorage
