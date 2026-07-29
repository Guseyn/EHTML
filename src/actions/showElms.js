import elms from '#ehtml/elms.js'

export default function showElms (...elmSelectors) {
  elmSelectors.forEach(elmSelector => {
    if (elmSelector) {
      const elememts = elms(elmSelector)
      for (let i = 0; i < elememts.length; i++) {
        const elememt = elememts[i]
        elememt.style.display = ''
      }
    }
  })
}

window.showElms = showElms
