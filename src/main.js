const observeNodeWithItsChildNodes = require('./observeNodeWithItsChildNodes')
const turnEhtmlMutationObserverOn = require('./turnEhtmlMutationObserverOn')
const turnEhtmlMutationObserverOff = require('./turnEhtmlMutationObserverOff')
const registerShowdownExtension = require('./registerShowdownExtension')
require('./actions/exports')

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
