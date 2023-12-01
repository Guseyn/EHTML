module.exports = (string, resName, resObj) => {
  // eslint-disable-next-line no-eval
  eval(
    '(() => {' + '\n' +
      `const ${resName} = resObj` + '\n' +
      string + '\n' +
    '})()'
  )
}
