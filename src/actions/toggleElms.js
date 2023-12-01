function toggleElms (className, ...elmSelectors) {
  elmSelectors.forEach(elmSelector => {
    if (elmSelector) {
      const elms = document.querySelectorAll(elmSelector)
      for (let i = 0; i < elms.length; i++) {
        const elm = elms[i]
        elm.classList.toggle(className)
      }
    }
  })
}

window.toggleElms = toggleElms
module.exports = toggleElms
