'use strict'

const { Endpoint, RequestParams } = require('@cuties/rest')
const { EndedResponse, WrittenResponse, ResponseWithHeader, ResponseWithStatusMessage, ResponseWithStatusCode } = require('@cuties/http')
const { StringifiedJSON, Value } = require('@cuties/json')
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
          new User(
            new Value(
              new RequestParams(
                request
              ), 'id'
            )
          )
        )
      )
    )
  }
}

module.exports = GetUserEndpoint
