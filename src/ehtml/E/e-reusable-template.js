import releaseTemplate from 'ehtml/actions/releaseTemplate'

export default (node) => {
  const releaseOnLoad = node.getAttribute('release-on-load') === 'true'
  if (releaseOnLoad) {
    releaseTemplate(node)
  }
}
