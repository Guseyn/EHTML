import * as showdown from '#ehtml/third-party/showdown.min.js?v=8e1f0558'

export default function (name, extensionFunction) {
  showdown.extension(name, extensionFunction)
  window.__ehtmlShowdownExtensions__.push(name)
}
