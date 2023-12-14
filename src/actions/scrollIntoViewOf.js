const elm = require('./../elm')

function scrollIntoViewOf (elmSelectorOrElm, options) {
  elm(elmSelectorOrElm).scrollIntoView(options)
}

window.scrollIntoViewOf = scrollIntoViewOf
module.scrollIntoViewOf = scrollIntoViewOf
