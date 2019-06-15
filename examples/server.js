'use strict'

const path = require('path')
const { ExecutedLint } = require('@cuties/wall')
const { SpawnedCommand } = require('@cuties/spawn')
const {
  Backend,
  RestApi,
  ServingFilesEndpoint,
  NotFoundEndpoint
} = require('@cuties/rest')
const {
  CopiedFile,
  WatcherWithEventTypeAndFilenameListener
} = require('@cuties/fs')
const { ReadDataByPath } = require('@cuties/fs')

const mapper = (url) => {
  let parts = url.split('/').filter(part => part !== '')
  return path.join(...parts)
}

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
            new ServingFilesEndpoint(new RegExp(/^(\/|)/), mapper, {}, new NotFoundEndpoint(new RegExp(/\/not-found/))),
          )
        )
      )
    )
  )
).call()
