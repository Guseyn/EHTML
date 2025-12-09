export default function getNodeScopedState(node) {
  let current = node

  while (current) {
    const state = window.__EHTML_SCOPED_STATE__.get(current)
    if (state) {
      return state
    }
    current = current.parentNode
  }

  return {}
}