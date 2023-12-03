module.exports = (string, resName, resObj, node) => {
  // eslint-disable-next-line no-eval
  eval(
    '(() => {' + '\n' +
      'const thisElement = node' + '\n' +
      `const ${resName} = resObj` + '\n' +
      string + '\n' +
    '})()'
  )
}
