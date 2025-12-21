import getNodeScopedState from '#ehtml/getNodeScopedState.js'

export default function setNodeScopedState(node, state) {
  if (!node || typeof node !== 'object') {
    throw new Error('setNodeScopedState: node must be a DOM element');
  }
  const inheritedState = getNodeScopedState(node)

  const canMerge =
    inheritedState &&
    typeof inheritedState === 'object' &&
    !Array.isArray(inheritedState) &&
    state &&
    typeof state === 'object' &&
    !Array.isArray(state)

  const newState = Object.freeze(
    canMerge ? { ...inheritedState, ...state } : state
  )

  window.__EHTML_SCOPED_STATE__.set(node, newState)
}
