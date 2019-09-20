'use strict'

const { TheSameObjectWithValue } = require('@cuties/object')
const Actions = require('./../util/Actions')

class AppliedActionsOnResponse {
  constructor (tagName, objName, actions, supportedActions, obj) {
    const OBJ = {}
    return new TheSameObjectWithValue(OBJ, objName, obj).after(
      new Actions(
        tagName,
        actions,
        supportedActions
      ).asAsyncTree(OBJ)
    )
  }
}

module.exports = AppliedActionsOnResponse
