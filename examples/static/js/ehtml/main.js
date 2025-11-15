// EHTML: v2.0.21

import observeNodeWithItsChildNodes from '#ehtml/observeNodeWithItsChildNodes.js?v=237b82a0'
import turnEhtmlMutationObserverOn from '#ehtml/turnEhtmlMutationObserverOn.js?v=cdec7143'
import turnEhtmlMutationObserverOff from '#ehtml/turnEhtmlMutationObserverOff.js?v=251ee5f3'
import registerShowdownExtension from '#ehtml/registerShowdownExtension.js?v=fea75542'
// eslint-disable-next-line no-unused-vars
import actions from '#ehtml/actions/exports.js?v=0b990341'

window.__ehtmlState__ = window.__ehtmlState__ || {}
window.__ehtmlCustomElements__ = window.__ehtmlCustomElements__ || {}
window.__ehtmlShowdownExtensions__ = window.__ehtmlShowdownExtensions__ || []

window.ehtmlMutationObserver = new MutationObserver(
  (mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i]
          observeNodeWithItsChildNodes(node)
        }
      }
    }
  }
)

turnEhtmlMutationObserverOn(
  window.ehtmlMutationObserver
)

window.turnEhtmlMutationObserverOn = turnEhtmlMutationObserverOn
window.turnEhtmlMutationObserverOff = turnEhtmlMutationObserverOff
window.registerShowdownExtension = registerShowdownExtension

window.addEventListener('load', () => {
  observeNodeWithItsChildNodes(document)
})
