'use strict'

const { ResponseWithStatusCode, ResponseWithHeader, EndedResponse } = require('@cuties/http')
const { Endpoint, RequestBody } = require('@cuties/rest')
const { GeneratedHS256JWT } = require('@cuties/jwt')
const { ParsedJSON, StringifiedJSON, Value } = require('@cuties/json')
const { StringFromBuffer } = require('@cuties/buffer')
const { GoogleUserData } = require('@cuties/oauth')
const { ObjectWithValue } = require('@cuties/object')

class GoogleAuthEndpoint extends Endpoint {
  constructor (regexpUrl, type) {
    super(regexpUrl, type)
  }

  body (request, response) {
    return new EndedResponse(
      new ResponseWithStatusCode(
        new ResponseWithHeader(
          response, 'Content-Type', 'application/json'
        ), 200
      ),
      new StringifiedJSON(
        new ObjectWithValue(
          { },
          'jwt',
          new GeneratedHS256JWT(
            new GoogleUserData(
              new Value(
                new ParsedJSON(
                  new StringFromBuffer(
                    new RequestBody(request)
                  )
                ),
                'googleToken'
              )
            ),
            'F4D395AA61BEAB63D519AFEA7CDDC',
            15
          )
        )
      )
    )
  }
}

module.exports = GoogleAuthEndpoint
