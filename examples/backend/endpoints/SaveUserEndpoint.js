'use strict'

const { Endpoint, RequestBody } = require('@cuties/rest')
const { EndedResponse, WrittenResponse, ResponseWithHeader, ResponseWithStatusMessage, ResponseWithStatusCode } = require('@cuties/http')
const { StringifiedJSON, ParsedJSON } = require('@cuties/json')
const { StringFromBuffer } = require('@cuties/buffer')
const SavedUser = require('./../objects/SavedUser')

class SaveUserEndpoint extends Endpoint {
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
          new SavedUser(
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
    )
  }
}

module.exports = SaveUserEndpoint
