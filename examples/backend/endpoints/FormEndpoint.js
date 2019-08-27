'use strict'

const { Endpoint, RequestBody } = require('@cuties/rest')
const { EndedResponse, WrittenResponse, ResponseWithHeader, ResponseWithStatusMessage, ResponseWithStatusCode } = require('@cuties/http')
const { StringifiedJSON, ParsedJSON } = require('@cuties/json')
const { StringFromBuffer } = require('@cuties/buffer')

class FormEndpoint extends Endpoint {
  constructor (regexp) {
    super(regexp, 'POST')
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
          new ParsedJSON(
            new StringFromBuffer(
              new RequestBody(
                request
              )
            )
          )
        )
      )
    )
  }
}

module.exports = FormEndpoint
