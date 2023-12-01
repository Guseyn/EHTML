function removeElms (...elmSelectors) {
  elmSelectors.forEach(elmSelector => {
    if (elmSelector) {
      const elms = document.querySelectorAll(elmSelector)
      for (let i = 0; i < elms.length; i++) {
        const elm = elms[i]
        elm.parentNode.removeChild(elm)
      }
    }
  })
}

window.removeElms = removeElms
module.exports = removeElms