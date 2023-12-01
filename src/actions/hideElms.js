function hideElms (...elmSelectors) {
  elmSelectors.forEach(elmSelector => {
    if (elmSelector) {
      const elms = document.querySelectorAll(elmSelector)
      for (let i = 0; i < elms.length; i++) {
        const elm = elms[i]
        elm.style.display = 'none'
      }
    }
  })
}

window.hideElms = hideElms
module.exports = hideElms
