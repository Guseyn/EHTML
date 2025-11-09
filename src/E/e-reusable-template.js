import releaseTemplate from '#ehtml/actions/releaseTemplate.js?v=f3a89899'

export default (node) => {
  const releaseOnLoad = node.getAttribute('release-on-load') === 'true'
  if (releaseOnLoad) {
    releaseTemplate(node)
  }
}
