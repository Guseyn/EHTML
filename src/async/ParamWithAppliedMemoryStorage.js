'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const ParamWithAppliedMemoryStorage = require('./../objects/ParamWithAppliedMemoryStorage')

class AsyncParamWithAppliedMemoryStorage extends AsyncObject {
  constructor (param) {
    super(param)
  }

  syncCall () {
    return (param) => {
      return new ParamWithAppliedMemoryStorage(param).value()
    }
  }
}

module.exports = AsyncParamWithAppliedMemoryStorage
