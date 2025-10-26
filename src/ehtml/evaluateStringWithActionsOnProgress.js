export default function (string, node) {
  // Create a function using the Function constructor
  // eslint-disable-next-line no-new-func
  const func = new Function(
    'thisElement',
    `
      (() => {
        ${string}
      })()
    `
  )
  // Call the function, passing in `node` as `thisElement`
  func(node)
}
