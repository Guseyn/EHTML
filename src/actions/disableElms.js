function disableElms (...elmSelectors) {
  elmSelectors.forEach(elmSelector => {
    if (elmSelector) {
      const elms = document.querySelectorAll(elmSelector)
      for (let i = 0; i < elms.length; i++) {
        const elm = elms[i]
        elm.setAttribute('disabled', true)
      }
    }
  })
}

window.disableElms = disableElms
module.exports = disableElms
