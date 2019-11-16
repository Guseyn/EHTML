'use strict'

const { as } = require('@cuties/cutie')
const { Delayed } = require('@cuties/async')
const { IsNull } = require('@cuties/is')
const { If, Else } = require('@cuties/if-else')
const { Endpoint, RequestParams } = require('@cuties/rest')
const { EndedResponse, ResponseWithWrittenHead } = require('@cuties/http')
const { StringifiedJSON, Value } = require('@cuties/json')
const { CreatedOptions } = require('@cuties/object')
const { ByteLengthOfBuffer } = require('@cuties/buffer')
const FoundProfile = require('./../async/FoundProfile')

class GetProfileEndpoint extends Endpoint {
  constructor (regexp, type) {
    super(regexp, type)
  }

  body (request, response) {
    return new Delayed(
      null, 650
    ).after(
      new FoundProfile(
        new Value(
          new RequestParams(
            request
          ), 'name'
        )
      ).as('PROFILE').after(
        new If(
          new IsNull(
            as('PROFILE')
          ),
          new EndedResponse(
            new ResponseWithWrittenHead(
              response, 404, 'profile is not found',
              new CreatedOptions(
                'Content-Type', 'application/json'
              )
            ),
            new StringifiedJSON(
              { error: 'profile is not found' }
            )
          ),
          new Else(
            new StringifiedJSON(
              as('PROFILE')
            ).as('RESPONSE').after(
              new EndedResponse(
                new ResponseWithWrittenHead(
                  response, 200, 'ok',
                  new CreatedOptions(
                    'Content-Type', 'application/json',
                    'Content-Length', new ByteLengthOfBuffer(
                      as('RESPONSE')
                    )
                  )
                ),
                as('RESPONSE')
              )
            )
          )
        )
      )
    )
  }
}

module.exports = GetProfileEndpoint
