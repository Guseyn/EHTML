export default (elmsSelectorOrElm) => {
  if (typeof elmsSelectorOrElm === 'string') {
    return document.querySelectorAll(elmsSelectorOrElm)
  }
  return [ elmsSelectorOrElm ]
}
