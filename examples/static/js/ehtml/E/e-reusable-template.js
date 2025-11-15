import releaseTemplate from '#ehtml/actions/releaseTemplate.js?v=c6fc78de'

export default (node) => {
  const releaseOnLoad = node.getAttribute('release-on-load') === 'true'
  if (releaseOnLoad) {
    releaseTemplate(node)
  }
}
