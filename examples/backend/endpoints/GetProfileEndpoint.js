'use strict'

const { as } = require('@cuties/cutie')
const { Delayed } = require('@cuties/async')
const { IsUndefined } = require('@cuties/is')
const { If, Else } = require('@cuties/if-else')
const { Endpoint, RequestParams } = require('@cuties/rest')
const { EndedResponse, ResponseWithWrittenHead } = require('@cuties/http')
const { StringifiedJSON, Value } = require('@cuties/json')

const profiles = {
  'John': {
    'photo': '/../images/John.svg',
    'name': 'John',
    'email': 'john@email.com',
    'age': 27,
    'country': 'Canada',
    'profession': 'dentist'
  },
  'Amanda': {
    'photo': '/../images/Amanda.svg',
    'name': 'Amanda',
    'email': 'amanda@email.com',
    'age': 24,
    'country': 'Australia',
    'profession': 'race driver'
  }
}

class GetProfileEndpoint extends Endpoint {
  constructor (regexp, type) {
    super(regexp, type)
  }

  body (request, response) {
    return new Delayed(
      null, 900
    ).after(
      new Value(
        profiles,
        new Value(
          new RequestParams(
            request
          ), 'name'
        )
      ).as('PROFILE').after(
        new If(
          new IsUndefined(
            as('PROFILE')
          ),
          new EndedResponse(
            new ResponseWithWrittenHead(
              response, 404, 'profile is not found', {
                'Content-Type': 'application/json'
              }
            ),
            new StringifiedJSON(
              { error: 'profile is not found' }
            )
          ),
          new Else(
            new EndedResponse(
              new ResponseWithWrittenHead(
                response, 200, 'ok', {
                  'Content-Type': 'application/json'
                }
              ),
              new StringifiedJSON(
                as('PROFILE')
              )
            )
          )
        )
      )
    )
  }
}

module.exports = GetProfileEndpoint
