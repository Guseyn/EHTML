export default function (string, e, node) {
  // Create a function using the Function constructor
  // eslint-disable-next-line no-new-func
  const func = new Function(
    'thisElement',
    'event',
    `
      (() => {
        ${string}
      })()
    `
  )
  // Call the function, passing in `node` as `thisElement` and `e` as `event`
  func(node, e)
}
