'use strict'

const path = require('path')
const { AsyncObject } = require('@cuties/cutie')
const { ExecutedLint } = require('@cuties/wall')
const { SpawnedCommand } = require('@cuties/spawn')
const {
  Backend,
  RestApi,
  RequestParams,
  RequestBody,
  RequestWithProgress,
  Endpoint,
  ServingFilesEndpoint,
  NotFoundEndpoint
} = require('@cuties/rest')
const {
  EndedResponse,
  WrittenResponse,
  ResponseWithHeader,
  ResponseWithStatusMessage,
  ResponseWithStatusCode,
  ResponseWithWrittenHead
} = require('@cuties/http')
const {
  CopiedFile,
  WatcherWithEventTypeAndFilenameListener
} = require('@cuties/fs')
const { ReadDataByPath } = require('@cuties/fs')
const { StringFromBuffer } = require('@cuties/buffer')
const { StringifiedJSON, ParsedJSON } = require('@cuties/json')
const { Value } = require('@cuties/object')

const mapper = (url) => {
  let parts = url.split('/').filter(part => part !== '')
  return path.join(...parts)
}

// API ENDPOINTS

class GetUserEndpoint extends Endpoint {
  constructor (regexp) {
    super(regexp, 'GET')
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

class SimpleProgressEndpoint extends Endpoint {
  constructor (regexpUrl, type) {
    super(regexpUrl, type)
  }

  body (request, response) {
    return new EndedResponse(
      new WrittenResponse(
        new ResponseWithWrittenHead(
          response, 200, 'ok', {
            'Content-Type': 'text/plain'
          }
        ),
        new RequestBody(
          new RequestWithProgress(request, response)
        )
      ), ' is delivered'
    )
  }
}

//

class User extends AsyncObject {
  constructor (id) {
    super(id)
  }

  syncCall () {
    return (id) => {
      return {
        id: id,
        name: `Name${id}`,
        email: `${id}@email.com`
      }
    }
  }
}

class SavedUser extends AsyncObject {
  constructor (data) {
    super(data)
  }

  syncCall () {
    return (data) => {
      data.id = 3
      return data
    }
  }
}

// SERVER

new SpawnedCommand('grunt').after(
  new ExecutedLint(process, './src', './test').after(
    new WatcherWithEventTypeAndFilenameListener('./src', { persistent: true, recursive: true, encoding: 'utf8' }, (eventType, fileName) => {
      if (eventType === 'change') {
        new SpawnedCommand('grunt').after(
          new CopiedFile('ehtml.bundle.min.js', './examples/js/ehtml.bundle.min.js')
        ).call()
      }
    }).after(
      new CopiedFile('ehtml.bundle.min.js', './examples/js/ehtml.bundle.min.js').after(
        new Backend(
          'http', 
          8000, 
          '127.0.0.1',
          new RestApi(
            new GetUserEndpoint(new RegExp(/^\/user\?id=(\d+)/)),
            new SaveUserEndpoint(new RegExp(/^\/save_user/)),
            new SimpleProgressEndpoint(new RegExp(/^\/progress/), 'POST'),
            new ServingFilesEndpoint(
              new RegExp(/^(\/|)/),
              mapper,
              {}, 
              new NotFoundEndpoint(new RegExp(/\/not-found/))
            ),
            new NotFoundEndpoint(new RegExp(/\/not-found/))
          )
        )
      )
    )
  )
).call()
