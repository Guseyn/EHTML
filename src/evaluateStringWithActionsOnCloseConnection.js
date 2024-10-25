module.exports = (string, e, node) => {
  // eslint-disable-next-line no-eval
  eval(
    '(() => {' + '\n' +
      'const thisElement = node' + '\n' +
      'const event = e' + '\n' +
      string + '\n' +
    '})()'
  )
}
