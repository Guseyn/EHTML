const ATTRIBUTE_NAMES_TO_IGNORE_SINCE_THEY_MUST_BE_RESOLVED_IN_THEIR_OWN_SCOPE = [
  'data-actions-on-response',
  'data-list-to-iterate',
  'data-item-name',
  'data-bound-to'
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

const evaluatedStringWithParams = require('./evaluatedStringWithParams')
const evaluatedStringWithParamsFromState = require('./evaluatedStringWithParamsFromState')

module.exports = (node, state) => {
  if (node.attributes) {
    const nodeAttributes = Array.from(node.attributes)
    for (let i = 0; i < nodeAttributes.length; i++) {
      const attr = nodeAttributes[i]
      const isAttributeToBeObserved = ATTRIBUTE_NAMES_TO_IGNORE_SINCE_THEY_MUST_BE_RESOLVED_IN_THEIR_OWN_SCOPE.indexOf(attr.name) === -1 &&
        /\$\{([^${}]+)\}/gm.test(attr.value)
      if (!isAttributeToBeObserved) {
        continue
      }
      node.setAttribute(
        attr.name,
        state
          ? evaluatedStringWithParamsFromState(attr.value, state)
          : evaluatedStringWithParams(attr.value)
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
