module.exports = (string, node) => {
  // eslint-disable-next-line no-eval
  eval(
    '(() => {' + '\n' +
      'const thisElement = node' + '\n' +
      string + '\n' +
    '})()'
  )
}
