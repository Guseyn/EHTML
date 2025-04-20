import elm from 'ehtml/elm'

export default function scrollIntoViewOf (elmSelectorOrElm, options) {
  elm(elmSelectorOrElm).scrollIntoView(options)
}

window.scrollIntoViewOf = scrollIntoViewOf
