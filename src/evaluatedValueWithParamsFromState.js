export default function evaluatedValueWithParamsFromState(expression, state, node, clean = true) {
  if (!expression) {
    return null
  }
  state = state || {}

  // Must start with ${ and end with }
  expression = expression.trim()
  if (!expression.startsWith('${') || !expression.endsWith('}')) {
    throw new Error(`Expression must be wrapped in \${ ... }, got: "${expression}"`)
  }

  // Extract inside of ${ ... }
  // Remove first '${' and last '}'
  const inner = expression.slice(2, -1).trim()

  let cleaned = inner
  if (clean) {
    // Support newlines inside expression
    cleaned = inner.replace(/\n/g, ' ')
  }

  // Evaluate
  const func = new Function(
    'state',
    `
      with (state) {
        return (${cleaned});
      }
    `
  )
  try {
    return func.apply(node, [state])
  } catch (error) {
    throw new Error(`${expression} failed, ${error}`)
  }
}
