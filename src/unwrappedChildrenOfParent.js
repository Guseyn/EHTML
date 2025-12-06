import getNodeScopedState from "#ehtml/getNodeScopedState.js?v=41ab2bfa";
import setNodeScopedState from "#ehtml/setNodeScopedState.js?v=7806d68f";

export default function (parent) {
  // 1. Capture parent's scope before removing it
  const state = getNodeScopedState(parent);

  // Create fragment
  const docFrag = document.createDocumentFragment();

  // Move children into fragment
  while (parent.firstChild) {
    const child = parent.removeChild(parent.firstChild);
    docFrag.appendChild(child);
  }

  // 2. Reassign scope to the *new* parent of the children
  const newParent = parent.parentNode;
  if (!newParent) {
    throw new Error("unwrap: parent has no parentNode");
  }

  setNodeScopedState(newParent, state);

  // Replace parent with fragment
  newParent.replaceChild(docFrag, parent);

  return docFrag;
}
