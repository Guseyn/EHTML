'use strict'

const { TheSameObjectWithValue } = require('@cuties/object')
const ParsedActions = require('./../util/ParsedActions')
const BuiltAsyncTreeByParsedActions = require('./../util/BuiltAsyncTreeByParsedActions')

class AppliedActionsOnResponse {
  constructor (tagName, objName, actions, obj) {
    const OBJ = {}
    return new TheSameObjectWithValue(OBJ, objName, obj).after(
      new BuiltAsyncTreeByParsedActions(
        new ParsedActions(
          actions,
          tagName,
          OBJ,
          objName
        ).value()
      ).value()
    )
  }
}

module.exports = AppliedActionsOnResponse
