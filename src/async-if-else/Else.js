'use strict'

const { AsyncObject } = require('./../cutie/exports')

class Else extends AsyncObject {
  constructor (action) {
    super(() => {
      return action
    })
  }

  syncCall () {
    return (action) => {
      let actionTree = action()
      this.propagateCache(actionTree)
      actionTree.call()
      return true
    }
  }
}

module.exports = Else
