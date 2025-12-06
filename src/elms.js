export default function (elmsSelectorOrElm) {
  if (typeof elmsSelectorOrElm === 'string') {
    return document.querySelectorAll(elmsSelectorOrElm)
  }
  return [ elmsSelectorOrElm ]
}
