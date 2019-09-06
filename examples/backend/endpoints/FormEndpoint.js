'use strict'

const { as } = require('@cuties/cutie')
const { Endpoint, RequestBody } = require('@cuties/rest')
const { EndedResponse, WrittenResponse, ResponseWithHeader, ResponseWithStatusMessage, ResponseWithStatusCode } = require('@cuties/http')
const { StringifiedJSON, ParsedJSON } = require('@cuties/json')
const { StringFromBuffer, ByteLengthOfBuffer, BufferFromString } = require('@cuties/buffer')

class FormEndpoint extends Endpoint {
  constructor (regexp) {
    super(regexp, 'POST')
  }

  body (request, response) {
    return new BufferFromString(
      new StringifiedJSON(
        new ParsedJSON(
          new StringFromBuffer(
            new RequestBody(
              request
            )
          )
        )
      )
    ).as('RESPONSE').after(
      new EndedResponse(
        new WrittenResponse(
          new ResponseWithHeader(
            new ResponseWithHeader(
              new ResponseWithStatusMessage(
                new ResponseWithStatusCode(response, 200), 'ok'
              ),
              'Content-Type', 'application/json'
            ),
            'Content-Length',
            new ByteLengthOfBuffer(
              as('RESPONSE')
            )
          ),
          as('RESPONSE')
        )
      )
    )
  }
}

module.exports = FormEndpoint
