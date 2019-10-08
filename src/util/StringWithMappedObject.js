'use string'

class StringWithMappedObject {
  constructor (str, obj, objName) {
    this.str = str
    this.obj = obj
    this.objName = objName
  }

  value () {
    return this.str.replace(
      new RegExp(
        `\\$\{((\\s)?([^{}$]+\\s)?(${this.objName})(\\.[^\\s{}$]+)?(\\s)?(\\s[^{}$]+)?)}`, 'g'
      ),
      (match, p1) => {
        // eslint-disable-next-line no-unused-vars
        const obj = this.obj
        const objName = this.objName
        const expression = `
          const ${objName} = obj['${objName}']
          ${p1}
        `
        // eslint-disable-next-line no-eval
        const res = eval(expression)
        if (typeof res === 'object') {
          return JSON.stringify(res)
        }
        return res
      }
    )
  }
}

module.exports = StringWithMappedObject
