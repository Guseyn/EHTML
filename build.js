'use strict'

const { AsyncObject } = require('@cuties/cutie')
const { SpawnedCommand } = require('@cuties/spawn')
const { CopiedFile } = require('@cuties/fs')

class LoggedToOutput extends AsyncObject {
  constructor (log) {
    super(log)
  }

  asyncCall () {
    return (log, callback) => {
      callback(null, log)
    }
  }
}

const minFileName = process.env.LIGHT_MODE ? 'ehtml.light.bundle.min.js' : 'ehtml.bundle.min.js'

class BuiltJSFiles {
  constructor (jsMainFileName, jsMinBundleName) {
    return new SpawnedCommand(
      './node_modules/.bin/esbuild',
      process.env.LIGHT_MODE
        ? [ jsMainFileName, '--bundle', '--minify', `--outfile=${jsMinBundleName}`, '--define:process.env.LIGHT_MODE="true"' ]
        : [ jsMainFileName, '--bundle', '--minify', `--outfile=${jsMinBundleName}` ]
    ).after(
      new CopiedFile(jsMinBundleName, `./examples/static/js/${jsMinBundleName}`).after(
        new LoggedToOutput(
          `build for ${jsMinBundleName} is successful`
        )
      )
    )
  }
}

new BuiltJSFiles(
  'src/main.js', minFileName
).call()
