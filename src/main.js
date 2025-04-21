import observeNodeWithItsChildNodes from 'ehtml/observeNodeWithItsChildNodes'
import turnEhtmlMutationObserverOn from 'ehtml/turnEhtmlMutationObserverOn'
import turnEhtmlMutationObserverOff from 'ehtml/turnEhtmlMutationObserverOff'
import registerShowdownExtension from 'ehtml/registerShowdownExtension'
import actions from 'ehtml/actions/exports'

window.__ehtmlState__ = window.__ehtmlState__ || {}
window.__ehtmlCustomElements__ = window.__ehtmlCustomElements__ || {}
window.__ehtmlShowdownExtensions__ = window.__ehtmlShowdownExtensions__ || []

window.ehtmlMutationObserver = new MutationObserver(
  (mutationsList, observer) => {
    for (let mutation of mutationsList) {
      console.log(mutation)
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
