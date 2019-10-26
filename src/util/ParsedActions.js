'use strict'

const StringWithMappedObjectAndAppliedVariables = require('./../async/StringWithMappedObjectAndAppliedVariables')
const ParsedJSONOrString = require('./../async/ParsedJSONOrString')
const ActionByNameWithParams = require('./ActionByNameWithParams')

class ParsedActions {
  constructor (actions, tagName, resObj, objName, headersName, statusCodeName) {
    // act1(p1, p2); act(q1, q2); ...
    this.actions = actions
    this.tagName = tagName
    this.resObj = resObj
    this.objName = objName
    this.headersName = headersName
    this.statusCodeName = statusCodeName
  }

  value () {
    const parsedActions = { }
    if (!this.actions) {
      return {
        length: 0
      }
    }
    const splittedActions = this.actions
      .split(';')
      .map(action => action.trim())
      .filter(action => action.length !== 0)
    splittedActions.forEach((action, index) => {
      const executedIfStatement = /if([\s]+)?(\(.+\))([\s]+)/.exec(action)
      let ifStatement
      if (executedIfStatement) {
        ifStatement = executedIfStatement[0]
        action = action.replace(ifStatement, '')
      }
      const actionName = this.expressionName(action)
      const actionParams = this.expressionParams(action, actionName)
      let parsedAction
      if (ifStatement) {
        const ifStatementName = this.expressionName(ifStatement)
        const ifStatementParam = this.expressionParams(ifStatement, ifStatementName)[0]
        parsedAction = new ActionByNameWithParams(
          ifStatementName,
          ifStatementParam,
          new ActionByNameWithParams(
            actionName, ...actionParams
          ).value()
        ).value()
      } else {
        parsedAction = new ActionByNameWithParams(
          actionName, ...actionParams
        ).value()
      }
      parsedActions[index] = parsedAction
    })
    parsedActions.length = splittedActions.length
    return parsedActions
  }

  expressionName (action) {
    return action.split('(')[0].trim()
  }

  expressionParams (action, actionName) {
    const params = action.split(actionName)[1]
    // eslint-disable-next-line no-eval
    return eval(`this.funcWithParams${params}`)
  }

  funcWithParams (...params) {
    return params.map(param => {
      if (typeof param === 'object') {
        param = JSON.stringify(param)
      }
      return new ParsedJSONOrString(
        new StringWithMappedObjectAndAppliedVariables(
          new StringWithMappedObjectAndAppliedVariables(
            new StringWithMappedObjectAndAppliedVariables(
              param,
              this.resObj,
              this.objName
            ),
            this.resObj,
            this.headersName
          ),
          this.resObj,
          this.statusCodeName
        )
      )
    })
  }
}

module.exports = ParsedActions
