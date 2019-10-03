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
        email: `${id}@email.com`,
        connections: [
          { name: 'conn1' },
          { name: 'conn2' },
          { name: 'conn3' },
          { name: 'conn4' },
          { name: 'conn5' }
        ]
      }
    }
  }
}

module.exports = User
