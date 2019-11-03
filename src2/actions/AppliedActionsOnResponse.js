'use strict'

const { TheSameObjectWithValue } = require('./../async-object/exports')
const ParsedActions = require('./ParsedActions')
const BuiltAsyncTreeByParsedActions = require('./BuiltAsyncTreeByParsedActions')

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
