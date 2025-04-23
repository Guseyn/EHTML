import evaluatedStringWithParams from 'ehtml/evaluatedStringWithParams'
import evaluatedStringWithParamsFromState from 'ehtml/evaluatedStringWithParamsFromState'

const ATTRIBUTE_NAMES_TO_IGNORE_SINCE_THEY_MUST_BE_RESOLVED_IN_THEIR_OWN_SCOPE_AND_TIME = [
  'data-actions-on-response',
  'data-list-to-iterate',
  'data-item-name',
  'data-bound-to',
  'data-cache-from',
  'data-src',
  'data-request-headers',
  'data-request-url',
  'data-socket'
]

const TAGS_WITH_SRC_ATTRIBUTE = [
  'audio',
  'embed',
  'iframe',
  'img',
  'input',
  'script',
  'source',
  'track',
  'video',
  'midi-player'
]

export default function (node, state) {
  if (node.attributes) {
    const nodeAttributes = Array.from(node.attributes)
    for (let i = 0; i < nodeAttributes.length; i++) {
      const attr = nodeAttributes[i]
      const isAttributeToBeIgnored = ATTRIBUTE_NAMES_TO_IGNORE_SINCE_THEY_MUST_BE_RESOLVED_IN_THEIR_OWN_SCOPE_AND_TIME.indexOf(attr.name) >= 0 ||
        (
          attr.name === 'data-src' && TAGS_WITH_SRC_ATTRIBUTE.indexOf(node.tagName.toLowerCase()) === -1
        )
      const isAttributeWithParams = /\$\{([^${}]+)\}/gm.test(attr.value)
      const isAttributeToBeObserved = !isAttributeToBeIgnored && isAttributeWithParams
      if (isAttributeToBeIgnored && isAttributeWithParams) {
        node.__ehtmlState__ = state
      }
      if (!isAttributeToBeObserved) {
        continue
      }
      node.setAttribute(
        attr.name,
        state
          ? evaluatedStringWithParamsFromState(attr.value, state, node)
          : evaluatedStringWithParams(attr.value, node)
      )
      if (attr.name === 'data-text') {
        const textNode = document.createTextNode(
          attr.value
        )
        if (node.childNodes.length === 0) {
          node.appendChild(textNode)
        } else {
          node.insertBefore(textNode, node.childNodes[0])
        }
        node.removeAttribute('data-text')
        continue
      }
      if (attr.name === 'data-value') {
        node.value = attr.value
        node.removeAttribute('data-value')
        continue
      }
      if ((attr.name === 'data-src') && (TAGS_WITH_SRC_ATTRIBUTE.indexOf(node.tagName.toLowerCase()) !== -1)) {
        node.setAttribute('src', node.getAttribute('data-src'))
        node.removeAttribute('data-src')
        continue
      }
      if (attr.name === 'data-inner-html') {
        node.innerHTML = attr.value
        node.removeAttribute('data-inner-html')
        continue
      }
      if (attr.name === 'disabled' && attr.value === 'false') {
        node.removeAttribute('disabled')
        continue
      }
    }
  }
}
