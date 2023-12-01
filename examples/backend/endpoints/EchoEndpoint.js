'use strict'

const { Endpoint, RequestBody } = require('@cuties/rest')
const { EndedResponse, ResponseWithWrittenHead } = require('@cuties/http')
const { CreatedOptions } = require('@cuties/object')

class EchoEndpoint extends Endpoint {
  constructor (regexp, method) {
    super(regexp, method)
  }

  body (request, response) {
    return new EndedResponse(
      new ResponseWithWrittenHead(
        response, 200, 'ok',
        new CreatedOptions(
          'Content-Type', 'application/json'
        )
      ),
      new RequestBody(
        request
      )
    )
  }
}

module.exports = EchoEndpoint
