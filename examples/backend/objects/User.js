'use strict'

const { AsyncObject } = require('@cuties/cutie')

class User extends AsyncObject {
  constructor (id) {
    super(id)
  }

  syncCall () {
    return (id) => {
      return {
        id: id,
        name: `Name${id}`,
        email: `${id}@email.com`
      }
    }
  }
}

module.exports = User
