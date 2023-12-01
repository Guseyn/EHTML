const { ExecutedLint } = require('@cuties/wall')

new ExecutedLint(
  process,
  './src',
  './examples/backend/endpoints',
  './examples/backend/objects',
  './examples/backend/server.js'
).call()