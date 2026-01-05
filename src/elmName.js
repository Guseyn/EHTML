export default function (elm) {
  const tagName = elm.tagName.toLowerCase()
  const isAttr = elm.getAttribute('is')
  if (isAttr) {
    const type = isAttr.toLowerCase()
    if (customElements.get(type)) {
      return type
    }
  }

  return tagName
}