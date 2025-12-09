const pattern = /\${([^}]+)}/g

export default function (string, node) {
  if (!string) {
    return null
  }
  return string.replace(pattern, (match, expression) => {
    const inlinedExpression = expression.replace(/\n/g, ' ')
    // Use Function constructor to isolate the evaluation scope
     
    const func = new Function('thisElement', `return (${inlinedExpression});`)
    const evaluationResult = func(node)
    if (typeof evaluationResult === 'object') {
      return JSON.stringify(evaluationResult)
    }
    return evaluationResult
  })
}
