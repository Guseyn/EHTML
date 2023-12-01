'use strict'

const { AsyncObject } = require('@cuties/cutie')
const { SpawnedCommand } = require('@cuties/spawn')

class LoggedToOutput extends AsyncObject {
  constructor (log) {
    super(log)
  }

  asyncCall () {
    return (log, callback) => {
      console.log(log)
      callback(null, log)
    }
  }
}

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
              new LoggedToOutput(
                `build for ${jsMinBundleName} is successful`
              )
            )
          )
        )
      )
    )
  }
}

new BuiltJSFiles(
 [ 'src' ], 'main.js', 'ehtml.bundle.min.js'
).call()
