import elm from '#ehtml/elm.js?v=41b9eaba'

export default function scrollIntoViewOf (elmSelectorOrElm, options) {
  elm(elmSelectorOrElm).scrollIntoView(options)
}

window.scrollIntoViewOf = scrollIntoViewOf
