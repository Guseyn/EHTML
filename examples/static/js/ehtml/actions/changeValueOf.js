import elm from 'ehtml/elm'

export default function changeValueOf (elmSelectorOrElm, value) {
  elm(elmSelectorOrElm).value = value
}

window.changeValueOf = changeValueOf
