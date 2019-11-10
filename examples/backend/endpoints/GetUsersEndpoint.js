'use strict'

const { Endpoint } = require('@cuties/rest')
const { EndedResponse, WrittenResponse, ResponseWithHeader, ResponseWithStatusMessage, ResponseWithStatusCode } = require('@cuties/http')
const { StringifiedJSON } = require('@cuties/json')
const Users = require('./../objects/Users')
const User = require('./../objects/User')

class GetUsersEndpoint extends Endpoint {
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
            new User(5),
            new User(6),
            new User(7),
            new User(8),
            new User(9),
            new User(10),
            new User(11),
            new User(12),
            new User(13),
            new User(14),
            new User(15),
            new User(16),
            new User(17),
            new User(18),
            new User(19),
            new User(20),
            new User(21),
            new User(22),
            new User(23)
          )
        )
      )
    )
  }
}

module.exports = GetUsersEndpoint
