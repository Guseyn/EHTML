'use strict'

const { AsyncObject } = require('@cuties/cutie')

class Users extends AsyncObject {
  constructor (...users) {
    super(...users)
  }

  syncCall () {
    return (...users) => {
      return users
    }
  }
}

module.exports = Users
