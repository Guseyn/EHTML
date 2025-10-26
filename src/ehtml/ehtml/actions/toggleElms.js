import elms from 'ehtml/elms'

export default function toggleElms (className, ...elmSelectors) {
  elmSelectors.forEach(elmSelector => {
    if (elmSelector) {
      const elements = elms(elmSelector)
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i]
        element.classList.toggle(className)
      }
    }
  })
}

window.toggleElms = toggleElms
