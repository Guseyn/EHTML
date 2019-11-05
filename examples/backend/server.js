'use strict'

const path = require('path')
const { ExecutedLint } = require('@cuties/wall')
const { SpawnedCommand } = require('@cuties/spawn')
const { Backend, RestApi, ServingFilesEndpoint, NotFoundEndpoint } = require('@cuties/rest')
const { CopiedFile, WatcherWithEventTypeAndFilenameListener } = require('@cuties/fs')
const CustomIndexEndpoint = require('./endpoints/CustomIndexEndpoint')
const GetUsersByPageAndSizeEndpoint = require('./endpoints/GetUsersByPageAndSizeEndpoint')
const GetUserEndpoint = require('./endpoints/GetUserEndpoint')
const GetUsersEndpoint = require('./endpoints/GetUsersEndpoint')
const GoogleAuthEndpoint = require('./endpoints/GoogleAuthEndpoint')

const mapperForStatic = (url) => {
  const parts = url.split('/').filter(part => part !== '')
  return path.join('examples', 'backend', 'static', ...parts)
}

const mapperForSrc = (url) => {
  const mainPart = `${url.split('.html')[0]}.html`
  const parts = mainPart.split('/').filter(part => part !== '')
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
            new CustomIndexEndpoint(
              './examples/backend/static/html/index.html',
              new NotFoundEndpoint(new RegExp(/\/not-found/))
            ),
            new GetUserEndpoint(new RegExp(/^\/user\?id=(\d+)/), 'GET'),
            new GetUsersByPageAndSizeEndpoint(new RegExp(/^\/users\?page=(\d+)&size=(\d+)/), 'GET'),
            new GetUsersEndpoint(new RegExp(/^\/users/), 'GET'),
            new GoogleAuthEndpoint(new RegExp(/^\/google/), 'POST'),
            new ServingFilesEndpoint(
              new RegExp(/^\/(html|js|images)/),
              mapperForStatic,
              {},
              new NotFoundEndpoint(new RegExp(/\/not-found/))
            ),
            new ServingFilesEndpoint(
              new RegExp(/[^\s]+.html([/?][^\s]*)?$/),
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
