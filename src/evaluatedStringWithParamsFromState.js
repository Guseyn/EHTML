const pattern = /\${([^}]+)}/g

module.exports = (string, state) => {
  if (!string) {
    return null
  }
  return string.replace(pattern, (match, expression) => {
    // eslint-disable-next-line no-eval
    const evaluationResult = eval('(function() { with (state) { return (' + expression + ') }})()')
    if (typeof evaluationResult === 'object') {
      return JSON.stringify(evaluationResult)
    }
    return evaluationResult
  })
}
