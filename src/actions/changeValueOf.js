import elm from '#ehtml/elm.js'

export default function changeValueOf (elmSelectorOrElm, value) {
  elm(elmSelectorOrElm).value = value
}

window.changeValueOf = changeValueOf
