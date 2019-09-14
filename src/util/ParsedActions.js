'use strict'

const EmptyAsyncObject = require('./../async/EmptyAsyncObject')
const StringWithAppliedStorageVariables = require('./../async/StringWithAppliedStorageVariables')
const StringWithMappedObject = require('./../async/StringWithMappedObject')
const ParsedJSONOrString = require('./../async/ParsedJSONOrString')
const ActionByNameWithParams = require('./ActionByNameWithParams')

class ParsedActions {
  constructor (actions, supportedActions, tagName, obj) {
    // act1(p1, p2); act(q1, q2); ...
    this.actions = actions
    this.supportedActions = supportedActions
    this.tagName = tagName
    this.obj = obj
  }

  value () {
    const parsedActions = [ ]
    if (!this.actions) {
      return new EmptyAsyncObject()
    }
    const splitedActions = this.actions
      .split(';')
      .map(action => action.trim())
      .filter(action => action.length !== 0)
    splitedActions.forEach(action => {
      const actionName = action.split('(')[0].trim()
      if (this.supportedActions.indexOf(actionName) === -1) {
        throw new Error(`action ${actionName} is not supported for the element ${this.tagName}`)
      }
      const actionParams = this.actionParams(action, actionName)
      parsedActions.push(
        new ActionByNameWithParams(
          actionName, ...actionParams
        ).value()
      )
    })
    return parsedActions
  }

  actionParams (action, actionName) {
    return action
      .replace(')', '')
      .split(`${actionName}(`)[1]
      .split(',')
      .map(param => {
        return new ParsedJSONOrString(
          new StringWithMappedObject(
            new StringWithAppliedStorageVariables(
              param
            ), this.obj
          )
        )
      })
  }
}

module.exports = ParsedActions
