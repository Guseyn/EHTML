import elm from '#ehtml/elm.js?v=21adcdae'

export default function scrollIntoViewOf (elmSelectorOrElm, options) {
  elm(elmSelectorOrElm).scrollIntoView(options)
}

window.scrollIntoViewOf = scrollIntoViewOf
