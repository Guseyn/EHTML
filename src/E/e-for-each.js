module.exports = (node) => {
  throw new Error(
    'You can use e-for-each only for mapping objects in the attribute "data-actions-on-response", probably in the future there will be elements that would help you map global elements'
  )
}
