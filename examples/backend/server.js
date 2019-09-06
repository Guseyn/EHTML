'use strict'

const path = require('path')
const { ExecutedLint } = require('@cuties/wall')
const { SpawnedCommand } = require('@cuties/spawn')
const { Backend, RestApi, ServingFilesEndpoint, NotFoundEndpoint } = require('@cuties/rest')
const { CopiedFile, WatcherWithEventTypeAndFilenameListener } = require('@cuties/fs')
const GetUserEndpoint = require('./endpoints/GetUserEndpoint')
const SaveUserEndpoint = require('./endpoints/SaveUserEndpoint')
const GoogleAuthEndpoint = require('./endpoints/GoogleAuthEndpoint')
const FormEndpoint = require('./endpoints/FormEndpoint')

const mapperForStatic = (url) => {
  const parts = url.split('/').filter(part => part !== '')
  return path.join('examples', 'backend', 'static', ...parts)
}

const mapperForSrc = (url) => {
  const parts = url.split('/').filter(part => part !== '')
  return path.join('examples', 'src', ...parts)
}

const watcherEvent = (eventType, fileName) => {
  if (eventType === 'change') {
    new SpawnedCommand('grunt').after(
      new CopiedFile('ehtml.bundle.min.js', './examples/backend/static/js/ehtml.bundle.min.js')
    ).call()
  }
}

new SpawnedCommand('grunt').after(
  new ExecutedLint(process, './src', './test', './examples/backend/endpoints', './examples/backend/objects', './examples/backend/server.js').after(
    new WatcherWithEventTypeAndFilenameListener('./src', { persistent: true, recursive: true, encoding: 'utf8' }, watcherEvent).after(
      new CopiedFile('ehtml.bundle.min.js', './examples/backend/static/js/ehtml.bundle.min.js').after(
        new Backend(
          'http',
          8000,
          '127.0.0.1',
          new RestApi(
            new GetUserEndpoint(new RegExp(/^\/user\?id=(\d+)/)),
            new SaveUserEndpoint(new RegExp(/^\/save_user/)),
            new GoogleAuthEndpoint(new RegExp(/^\/google/), 'POST'),
            new FormEndpoint(new RegExp(/^\/form/)),
            new ServingFilesEndpoint(
              new RegExp(/^\/(html|js|images|csv)/),
              mapperForStatic,
              {},
              new NotFoundEndpoint(new RegExp(/\/not-found/))
            ),
            new ServingFilesEndpoint(
              new RegExp(/.html\/?$/),
              mapperForSrc,
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
