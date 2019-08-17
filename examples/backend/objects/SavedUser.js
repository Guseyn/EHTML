'use strict'

const { AsyncObject } = require('@cuties/cutie')

class SavedUser extends AsyncObject {
  constructor (data) {
    super(data)
  }

  syncCall () {
    return (data) => {
      data.id = 3
      return data
    }
  }
}

module.exports = SavedUser
