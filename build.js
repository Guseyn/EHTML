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

process.env.LIGHT_MODE = process.env.LIGHT_MODE || 'false'

const minFileName = process.env.LIGHT_MODE === 'true' ? 'ehtml.light.bundle.min.js' : 'ehtml.bundle.min.js'

console.log(minFileName, typeof process.env.LIGHT_MODE)

class BuiltJSFiles {
  constructor (jsMainFileName, jsMinBundleName) {
    return new SpawnedCommand(
      './node_modules/.bin/esbuild',
      [ jsMainFileName, '--bundle', '--minify', `--outfile=${jsMinBundleName}`, `--define:LIGHT_VERSION=${process.env.LIGHT_MODE}` ]
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
