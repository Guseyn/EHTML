'use strict'

const { TheSameObjectWithValue } = require('@cuties/object')
const ParsedActions = require('./../util/ParsedActions')
const BuiltAsyncTreeByParsedActions = require('./../util/BuiltAsyncTreeByParsedActions')

class AppliedActionsOnResponse {
  constructor (tagName, resName, res, actions) {
    const resObj = {}
    return new TheSameObjectWithValue(resObj, resName, res).after(
      new BuiltAsyncTreeByParsedActions(
        new ParsedActions(
          actions,
          tagName,
          resObj,
          resName
        ).value()
      ).value()
    )
  }
}

module.exports = AppliedActionsOnResponse
