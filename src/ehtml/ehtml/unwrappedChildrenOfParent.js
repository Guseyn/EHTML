export default function (parent) {
  const docFrag = document.createDocumentFragment()
  while (parent.firstChild) {
    const child = parent.removeChild(parent.firstChild)
    docFrag.appendChild(child)
  }
  parent.parentNode.replaceChild(docFrag, parent)
  return docFrag
}
