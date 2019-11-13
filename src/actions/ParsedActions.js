'use strict'

const ActionByNameWithParams = require('./ActionByNameWithParams')

class ParsedActions {
  constructor (actions, tagName, resObj, resName) {
    // act1(p1, p2); act(q1, q2); ...
    this.actions = actions
    this.tagName = tagName
    this.resObj = resObj
    this.resName = resName
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
      return this.evaluatedParam(param, this.resObj, this.resName)
    })
  }

  evaluatedParam (param, resObj, resName) {
    if (typeof param === 'string') {
      if (!/\$\{([^${}]+)\}/g.test(param)) {
        return param
      }
      // eslint-disable-next-line no-eval
      return eval(`
        const ${resName} = resObj
        ${param.replace(/\$\{([^${}]+)\}/g, (match, p1) => { return p1 })}
      `)
    }
    if (typeof param === 'object') {
      for (let key in param) {
        param[key] = this.evaluatedParam(param[key], resObj, resName)
      }
      return param
    }
    return param
  }
}

module.exports = ParsedActions
