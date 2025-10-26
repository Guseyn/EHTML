import elms from 'ehtml/elms'

export default function disableElms (...elmSelectors) {
  elmSelectors.forEach(elmSelector => {
    if (elmSelector) {
      const elements = elms(elmSelector)
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i]
        element.setAttribute('disabled', true)
      }
    }
  })
}

window.disableElms = disableElms
