const elm = require('./../elm')

export default function addHTMLInto (elmSelectorOrElm, html) {
  elm(elmSelectorOrElm).innerHTML += html
}

window.addHTMLInto = addHTMLInto
