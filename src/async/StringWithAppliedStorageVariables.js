'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const StringWithAppliedStorageVariables = require('./../util/StringWithAppliedStorageVariables')

class AsyncStringWithAppliedStorageVariables extends AsyncObject {
  constructor (str) {
    super(str)
  }

  syncCall () {
    return (str) => {
      return new StringWithAppliedStorageVariables(str).value()
    }
  }
}

module.exports = AsyncStringWithAppliedStorageVariables
