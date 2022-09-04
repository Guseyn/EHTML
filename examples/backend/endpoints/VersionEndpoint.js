'use strict'

const { Delayed } = require('@cuties/async')
const { Endpoint } = require('@cuties/rest')
const { EndedResponse, ResponseWithWrittenHead } = require('@cuties/http')
const { StringifiedJSON } = require('@cuties/json')
const { CreatedOptions } = require('@cuties/object')

const versionObject = {
  version: 6
}

class VersionEndpoint extends Endpoint {
  constructor (regexp) {
    super(regexp, 'GET')
  }

  body (request, response) {
    return new Delayed(
      null, 150
    ).after(
      new EndedResponse(
        new ResponseWithWrittenHead(
          response, 200, 'ok',
          new CreatedOptions(
            'Content-Type', 'application/json'
          )
        ),
        new StringifiedJSON(versionObject)
      )
    )
  }
}

module.exports = VersionEndpoint
