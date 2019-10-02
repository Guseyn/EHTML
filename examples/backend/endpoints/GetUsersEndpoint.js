'use strict'

const { Endpoint } = require('@cuties/rest')
const { EndedResponse, WrittenResponse, ResponseWithHeader, ResponseWithStatusMessage, ResponseWithStatusCode } = require('@cuties/http')
const { StringifiedJSON } = require('@cuties/json')
const Users = require('./../objects/Users')
const User = require('./../objects/User')

class GetUserEndpoint extends Endpoint {
  constructor (regexp, type) {
    super(regexp, type)
  }

  body (request, response) {
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithHeader(
          new ResponseWithStatusMessage(
            new ResponseWithStatusCode(response, 200), 'ok'
          ),
          'Content-Type', 'application/json'
        ),
        new StringifiedJSON(
          new Users(
            new User(1),
            new User(2),
            new User(3),
            new User(4),
            new User(5)
          )
        )
      )
    )
  }
}

module.exports = GetUserEndpoint
