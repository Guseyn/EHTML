export default function shouldSkipNode(node) {
  if (node.parentNode?.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    return true
  }
  if (node.parentElement && node.parentElement.closest('[data-no-ehtml="true"]')) {
    return true
  }
  return node.hasAttribute &&
    node.hasAttribute('data-no-ehtml') &&
    (node.getAttribute('data-no-ehtml') === 'true')
}
