module.exports = (string, event, node) => {
  // eslint-disable-next-line no-eval
  eval(
    '(() => {' + '\n' +
      'const thisElement = node' + '\n' +
      'const event = ' + event + '\n' +
      string + '\n' +
    '})()'
  )
}
