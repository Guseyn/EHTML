'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const StringWithAppliedUrlParams = require('./../util/StringWithAppliedUrlParams')

class AsyncStringWithAppliedUrlParams extends AsyncObject {
  constructor (str) {
    super(str)
  }

  syncCall () {
    return (str) => {
      return new StringWithAppliedUrlParams(str).value()
    }
  }
}

module.exports = AsyncStringWithAppliedUrlParams
