'use strict'

const { AsyncObject } = require('./../cutie/exports')
const ParsedActions = require('./ParsedActions')
const BuiltAsyncTreeByParsedActions = require('./BuiltAsyncTreeByParsedActions')

class AppliedActionsOnResponse extends AsyncObject {
  constructor (element, tagName, resName, res, actions) {
    super(element, tagName, resName, res, actions)
  }

  syncCall () {
    return (element, tagName, resName, res, actions) => {
      if (!resName) {
        throw new Error(`You need to specify attribute "data-response-name" in <${tagName}>`)
      }
      new BuiltAsyncTreeByParsedActions(
        new ParsedActions(
          element,
          actions,
          tagName,
          res,
          resName
        ).value()
      ).value().call()
    }
  }
}

module.exports = AppliedActionsOnResponse
