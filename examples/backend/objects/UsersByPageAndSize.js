'use strict'

const { AsyncObject } = require('@cuties/cutie')

class UsersByPageAndSize extends AsyncObject {
  constructor (users, page, size) {
    super(users, page, size)
  }

  syncCall () {
    return (users, page, size) => {
      return users.slice(page * size, (page + 1) * size)
    }
  }
}

module.exports = UsersByPageAndSize
