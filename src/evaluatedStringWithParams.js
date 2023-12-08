const pattern = /\${([^}]+)}/g

module.exports = (string, node) => {
  if (!string) {
    return null
  }
  return string.replace(pattern, (match, expression) => {
    // eslint-disable-next-line no-eval
    const evaluationResult = eval('(function() { const thisElement = node; return (' + expression + ')})()')
    if (typeof evaluationResult === 'object') {
      return JSON.stringify(evaluationResult)
    }
    return evaluationResult
  })
}
