'use strict'

class Event {
  constructor () {}

  // TO BE OVERRIDDEN

  body (...args) {
    throw new Error(`Method body must be overriden with arguments ${args} of the event/eventListener you call`)
  }
}

module.exports = Event
