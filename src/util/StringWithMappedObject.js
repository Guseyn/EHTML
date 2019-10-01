'use string'

class StringWithMappedObject {
  constructor (str, obj, objName) {
    this.str = str
    this.obj = obj
    this.objName = objName
  }

  value () {
    // console.log(this.str, this.objName, this.obj)
    return this.str.replace(
      new RegExp(
        `\\$\{((\\s)?([^{}$]+\\s)?(${this.objName})(\\.[^\\s{}$]+)?(\\s)?(\\s[^{}$]+)?)}`, 'g'
      ),
      (match, p1) => {
        const obj = this.obj
        const objName = this.objName
        try {
          const expression = p1.replace(
            new RegExp(
              `${this.objName}(\\.[^{}$\\s]+)?`, 'g'
            ), (match, p1) => {
              // eslint-disable-next-line no-eval
              const value = p1 ? eval(`obj[objName]${p1}`) : obj[objName]
              if (typeof value === 'object') {
                return JSON.stringify(value)
              }
              return value
            }
          )
          // eslint-disable-next-line no-eval
          const res = eval(`'${expression}'`)
          if (typeof res === 'object') {
            return JSON.stringify(res)
          }
          return res
        } catch (e) {
          return match
        }
      }
    )
  }
}

module.exports = StringWithMappedObject
