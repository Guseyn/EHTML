import elms from '#ehtml/elms.js?v=fcdf76bb'

export default function removeElms (...elmSelectors) {
  elmSelectors.forEach(elmSelector => {
    if (elmSelector) {
      const elements = elms(elmSelector)
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i]
        element.parentNode.removeChild(element)
      }
    }
  })
}

window.removeElms = removeElms
