const pattern = /\${([^}]+)}/g

module.exports = (string) => {
  if (!string) {
    return null
  }
  return string.replace(pattern, (match, expression) => {
    // eslint-disable-next-line no-eval
    const evaluationResult = eval('(function() { return ' + expression + '})()')
    if (typeof evaluationResult === 'object') {
      return JSON.stringify(evaluationResult)
    }
    return evaluationResult
  })
}