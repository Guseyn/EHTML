'use strict'

const { TheSameObjectWithValue } = require('@cuties/object')
const ParsedActions = require('./../util/ParsedActions')
const BuiltAsyncTreeByParsedActions = require('./../util/BuiltAsyncTreeByParsedActions')

class AppliedActionsOnResponse {
  constructor (tagName, objName, obj, headersName, headers, statusCodeName, statusCode, actions) {
    const resObj = {}
    return new TheSameObjectWithValue(resObj, objName, obj).after(
      new TheSameObjectWithValue(resObj, headersName, headers).after(
        new TheSameObjectWithValue(resObj, statusCodeName, statusCode).after(
          new BuiltAsyncTreeByParsedActions(
            new ParsedActions(
              actions,
              tagName,
              resObj,
              objName,
              headersName,
              statusCodeName
            ).value()
          ).value()
        )
      )
    )
  }
}

module.exports = AppliedActionsOnResponse
