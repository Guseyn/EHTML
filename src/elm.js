module.exports = (elmSelectorOrElm) => {
  if (typeof elmSelectorOrElm === 'string') {
    return document.querySelector(elmSelectorOrElm)
  }
  return elmSelectorOrElm
}
