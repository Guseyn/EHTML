'use strict'

const { ExecutedLint } = require('@cuties/wall')
const { SpawnedCommand } = require('@cuties/spawn')

new SpawnedCommand('grunt').after(
  new ExecutedLint(process, './src')
).call()
