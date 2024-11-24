const showdown = require('showdown')

module.exports = function (name, extensionFunction) {
  showdown.extension(name, extensionFunction)
  window.__ehtmlShowdownExtensions__.push(name)
}
