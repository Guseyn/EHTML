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
  constructor (jsFoldersToBundle, jsMainFileName, jsMinBundleName) {
    const buidName = jsMinBundleName.split('.')[0]
    return new SpawnedCommand(
      './node_modules/.bin/babel',
      [ ...jsFoldersToBundle, '--out-dir', `${buidName}-js-out`, '--config-file', './.babelrc' ]
    ).after(
      new SpawnedCommand(
        './node_modules/.bin/browserify',
        [ `${buidName}-js-out/${jsMainFileName}`, '--outfile', `${buidName}-tmp-bundle.js` ]
      ).after(
        new SpawnedCommand(
          './node_modules/.bin/uglifyjs',
          [ `${buidName}-tmp-bundle.js`, '--output', jsMinBundleName ]
        ).after(
          new SpawnedCommand(
            'rm',
            ['-r', '-f', `${buidName}-js-out`]
          ).after(
            new SpawnedCommand(
              'rm',
              [ `${buidName}-tmp-bundle.js` ]
            ).after(
              new CopiedFile(jsMinBundleName, `./examples/static/js/${jsMinBundleName}`).after(
                new LoggedToOutput(
                  `build for ${jsMinBundleName} is successful`
                )
              )
            )
          )
        )
      )
    )
  }
}

new BuiltJSFiles(
 [ 'src' ], 'main.js', minFileName
).call()
