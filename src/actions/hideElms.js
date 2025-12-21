import elms from '#ehtml/elms.js'

export default function hideElms (...elmSelectors) {
  elmSelectors.forEach(elmSelector => {
    if (elmSelector) {
      const elements = elms(elmSelector)
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i]
        element.style.display = 'none'
      }
    }
  })
}

window.hideElms = hideElms
