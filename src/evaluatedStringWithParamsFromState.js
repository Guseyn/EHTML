const pattern = /\${([^}]+)}/g

export default function evaluatedStringWithParamsFromState(string, state, node) {
  if (!string) {
    return null
  }
  state = state || {}
  return string.replace(pattern, (match, expression) => {
    const inlinedExpression = expression.replace(/\n/g, ' ')
    try {
      // Use Function constructor and pass state and this as arguments
      // eslint-disable-next-line no-new-func
      const func = new Function(
        'state',
        `
          with (state) {
            return (${inlinedExpression})
          }
        `
      )
      const evaluationResult = func.apply(node, [state])
      if (typeof evaluationResult === 'object') {
        return JSON.stringify(evaluationResult)
      }
      return evaluationResult
    } catch (err) {
      console.error(`Inlined expression ${inlinedExpression} fails, scoped state is -> `, state)
      throw err
    }
  })
}
