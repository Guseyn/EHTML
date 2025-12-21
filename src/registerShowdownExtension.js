import * as showdown from '#ehtml/third-party/showdown.min.js'

export default function (name, extensionFunction) {
  showdown.extension(name, extensionFunction)
  window.__ehtmlShowdownExtensions__.push(name)
}
