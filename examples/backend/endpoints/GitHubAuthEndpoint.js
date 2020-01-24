'use strict'

const { ResponseWithStatusCode, ResponseWithHeader, EndedResponse } = require('@cuties/http')
const { Endpoint, RequestBody } = require('@cuties/rest')
const { GeneratedHS256JWT } = require('@cuties/jwt')
const { ParsedJSON, StringifiedJSON, Value } = require('@cuties/json')
const { StringFromBuffer } = require('@cuties/buffer')
const { GitHubUserData } = require('@cuties/oauth')
const { ObjectWithValue } = require('@cuties/object')

const clientId = '9740bb12713949b1c23d'
const clientSecret = '300c8427a2562a2851e4dc7dbc1e3a7b50328c8c'

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
            new GitHubUserData(
              new Value(
                new ParsedJSON(
                  new StringFromBuffer(
                    new RequestBody(request)
                  )
                ),
                'code'
              ),
              clientId, clientSecret
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
