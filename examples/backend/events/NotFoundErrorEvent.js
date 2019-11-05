'use strict'

const { Event } = require('@cuties/cutie')

class NotFoundErrorEvent extends Event {
  constructor (notFoundEndpoint, request, response) {
    super()
    this.notFoundEndpoint = notFoundEndpoint
    this.request = request
    this.response = response
  }

  body () {
    this.notFoundEndpoint.body(this.request, this.response).call()
  }
}

module.exports = NotFoundErrorEvent
