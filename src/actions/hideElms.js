import elms from '#ehtml/elms.js?v=4758068d'

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
