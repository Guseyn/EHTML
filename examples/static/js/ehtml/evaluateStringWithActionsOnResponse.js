export default function (string, resName, resObj, node) {
  // Create a dynamic function string to define the resource name
  const dynamicFunctionBody = `
    const thisElement = node
    const ${resName} = resObj
    ${string}
  `

  // Use Function constructor for execution
  // eslint-disable-next-line no-new-func
  const func = new Function('node', 'resObj', dynamicFunctionBody)

  // Call the function, passing in `node` and `resObj`
  func(node, resObj)
}
