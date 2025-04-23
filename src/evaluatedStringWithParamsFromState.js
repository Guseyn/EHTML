const pattern = /\${([^}]+)}/g

export default function (string, state, node) {
  if (!string) {
    return null
  }
  state = state || {}
  return string.replace(pattern, (match, expression) => {
    const inlinedExpression = expression.replace(/\n/g, ' ')
    // Use Function constructor and pass state and thisElement as arguments
    // eslint-disable-next-line no-new-func
    const func = new Function('state', 'thisElement', `
      with (state) {
        return (${inlinedExpression});
      }
    `)
    const evaluationResult = func(state, node)
    if (typeof evaluationResult === 'object') {
      return JSON.stringify(evaluationResult)
    }
    return evaluationResult
  })
}
