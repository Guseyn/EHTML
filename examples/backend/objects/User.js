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
          { name: 'conn1', ports: [{ id: 1 }, { id: 2 }, { id: 3 }] },
          { name: 'conn2', ports: [{ id: 1 }, { id: 2 }, { id: 3 }] },
          { name: 'conn3', ports: [{ id: 1 }, { id: 2 }, { id: 3 }] },
          { name: 'conn4', ports: [{ id: 1 }, { id: 2 }, { id: 3 }] },
          { name: 'conn5', ports: [{ id: 1 }, { id: 2 }, { id: 3 }] }
        ]
      }
    }
  }
}

module.exports = User
