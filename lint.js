const { ExecutedLint } = require('@cuties/wall')

new ExecutedLint(
  process,
  './src',
  './examples/jwt.js',
  './examples/playlist.js',
  './examples/profiles.js',
  './examples/server.js'
).call()